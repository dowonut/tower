import { AttachmentBuilder, Interaction, TextChannel } from "discord.js";
import { game, prisma, config } from "../../../tower.js";
import PlayerClass from "../../../game/_classes/players.js";
import { EnemyClass } from "../../../game/_classes/enemies.js";
import emojis from "../../../emojis.js";
import _, { add } from "lodash";
import { Menu, f } from "../index.js";

/** handleEncounter */
export default async function handleEncounter(args: {
  players: Player[];
  enemies: Enemy[];
  encounter: Encounter;
  turnOrder: TurnOrder;
  channel: TextChannel;
}) {
  const { players, enemies, channel } = args;
  let { encounter, turnOrder } = args;
  // Handle edge cases
  if (encounter.enemies.length < 1 || encounter.players.length < 1) return;

  // Check if all enemies are already dead
  if (_.isEmpty(enemies) || enemies.every((x) => x?.dead)) return await killEncounter();

  // Get first player
  const firstPlayer: Player = game.getNextPlayer(turnOrder);

  // Define menu variables
  const variables = {
    players,
    enemies,
    turnOrder,
    targets: [] as number[],
    encounterImage: undefined,
    pendingAction: undefined as Action,
  };

  //* Create menu ==========================
  const menu = new game.Menu({
    player: firstPlayer,
    variables,
    boards: [
      // Select enemies and pick action
      { name: "main", rows: ["main_actions", "other_actions"], message: "main" },
      // Enemy selected and pick attack
      {
        name: "select_attack",
        rows: ["attacks", "action_options"],
      },
      {
        name: "select_target",
        message: "main",
        rows: ["select_target", "cancel_action"],
      },
      {
        name: "no_input",
        rows: [],
        message: "main",
      },
      {
        name: "end",
        rows: [],
        message: "main",
      },
    ],
    rows: [
      // Select enemy
      {
        name: "enemies",
        type: "menu",
        components: (m) => getSelectTargetMenu(m),
      },
      // Non-combat actions
      {
        name: "other_actions",
        type: "buttons",
        components: (m) => {
          return [
            {
              id: "flee",
              label: "Flee",
              emoji: "💨",
              function: async (r, i) => {
                const response = await m.player.runCommand({ name: "flee" });
                if (response !== "success") return;
                m.botMessage.delete();
              },
            },
          ];
        },
      },
      // Main actions
      {
        name: "main_actions",
        type: "buttons",
        components: (m) => {
          return [
            {
              id: "attack",
              label: "Attack",
              style: "primary",
              emoji: config.emojis.weapons.sword,
              board: "select_attack",
            },
            {
              id: "magic",
              label: "Magic",
              style: "primary",
              disable: true,
              emoji: config.emojis.magic,
              function() {},
            },
            {
              id: "other",
              label: "Other",
              disable: true,
              style: "primary",
              function() {},
            },
          ];
        },
      },
      // Attack buttons
      {
        name: "attacks",
        type: "buttons",
        async components(m) {
          const attacks = await m.player.getActions({ onlyAvailable: true, type: "weapon_attack" });
          if (!attacks[0])
            return [
              { id: "noAttacks", label: "No attacks available...", disable: true },
              { id: "return", board: "enemySelected" },
            ];
          return attacks.map((x) => {
            const requiredTargets = x.getRequiredTargets();
            let extraInfo = ``;
            if (!x.remCooldown) {
              extraInfo = `(${x.getBriefDamageText({
                totalEnemies: getAliveEnemies().length,
              })})`;
            } else {
              extraInfo = `(⏳${x.remCooldown} turns)`;
            }
            return {
              id: x.name,
              label: `${x.getName()} ` + extraInfo,
              style: "success",
              stop: true,
              emoji: x.getEmoji(),
              disable: x.remCooldown > 0,
              async function() {
                // Automatically select remaining living enemy as target, or automatically target all enemies
                if (
                  getAliveEnemies().length <= 1 ||
                  !x.outcomes.some((x) => x.targetType !== "all")
                ) {
                  await game.runCommand("attack", {
                    message: m.botMessage,
                    discordId: m.player.user.discordId,
                    server: m.player.server,
                    args: [
                      x.name,
                      ...Array(requiredTargets).fill(getAliveEnemies()[0].number.toString(), 0),
                    ],
                  });
                }
                // Prompt user to select target
                else {
                  m.variables.pendingAction = x;
                  m.switchBoard("select_target");
                }
              },
            };
          });
        },
      },
      // Action options
      {
        name: "action_options",
        type: "buttons",
        components: (m) => {
          let actionType: ActionType;
          let label: string;
          let componentFunction: ComponentFunction;
          switch (m.currentBoard) {
            // Weapon attacks
            case "select_attack":
              actionType = "weapon_attack";
              label = "Attacks";
              componentFunction = async () => {
                await game.runCommand("attack", {
                  message: m.botMessage,
                  discordId: m.player.user.discordId,
                  server: m.player.server,
                });
              };
              break;
          }
          return [
            { id: "info", emoji: emojis.info, label: `View ${label}`, function: componentFunction },
          ];
        },
      },
      // Select target
      {
        name: "select_target",
        type: "menu",
        components: (m) => getSelectTargetMenu(m, m.variables.pendingAction.getRequiredTargets()),
      },
      // Cancel action
      {
        name: "cancel_action",
        type: "buttons",
        components: (m) => [
          {
            id: "cancelAction",
            label: "Cancel Action",
            style: "danger",
            function: async () => {
              m.variables.pendingAction = undefined;
              m.variables.targets = [];
              await m.switchBoard("main");
            },
          },
        ],
      },
    ],
    messages: [
      // Main combat embed
      {
        name: "main",
        function: async (m) => {
          const enemies = m.variables.enemies;
          const players = m.variables.players;
          const currentEntity = m.variables.turnOrder[0];
          const isPlayer = currentEntity instanceof PlayerClass ? true : false;
          const partyName = players.length > 1 ? "Party" : `${players[0].user.username}`;
          const enemyName = enemies.length > 1 ? "multiple enemies" : enemies[0].displayName;
          const title = `${partyName} fighting ${enemyName}`;
          let description = ``;

          // Get enemy image
          if (!m.variables.encounterImage) {
            m.variables.encounterImage = await game.createEncounterImage({
              enemies: enemies.sort((a, b) => a.number - b.number),
              verbose: true,
              targets: m.variables.targets,
            });
          }

          // Format turn order list
          let turnOrderList = ``;
          let i = 0;
          for (const entity of m.variables.turnOrder) {
            const current = i == 0 ? "▶ " : "";
            let name: string;
            // Format name
            if (entity.dead) {
              name = `\u001b[1;2;30m${entity.displayName}\u001b[0m`;
            } else if (entity.isPlayer) {
              name = `\u001b[1;2;37m${entity.displayName}\u001b[0m`;
            } else {
              name = `\u001b[1;2;31m${entity.displayName}\u001b[0m`;
            }
            // Format extra info
            const infoValue = entity.dead ? "dead" : entity.SV;
            const info = `\u001b[0;2;30m [${infoValue}]\u001b[0m`;
            turnOrderList += `${current}${name}${info}\n`;
            i++;
          }
          description += `\`\`\`ansi
${turnOrderList}
\`\`\``;

          // Return with message
          return game.fastEmbed({
            player: m.player,
            title,
            description,
            fullSend: false,
            reply: false,
            content: isPlayer ? m.player.ping : "",
            embed: { image: { url: `attachment://encounter.png` } },
            files: [m.variables.encounterImage],
            pingParty: !isPlayer,
          });
        },
      },
      // Specific enemy info
      //   {
      //     name: "info",
      //     function: async (m) => {
      //       const partyPing = m.variables.players.map((x) => x.ping).join(" ");

      //       return game.fastEmbed({ message: m.botMessage, player: m.player });
      //     },
      //   },
    ],
    // Update encounter once menu is loaded
    onLoad: async (m) => {
      // Add message to database
      encounter = await prisma.encounter.update({
        where: { id: encounter.id },
        data: {
          discordMessageId: menu.botMessage?.id,
          discordChannelId: menu.botMessage?.channelId,
        },
        include: { players: true, enemies: true },
      });
    },
  });

  // Initiate encounter message
  // If player
  if (turnOrder[0] instanceof PlayerClass) {
    await turnOrder[0].update({ encounter: { update: { currentPlayer: turnOrder[0].id } } });
    await updateMenu("player", true);
  }
  // If enemy
  else if (turnOrder[0] instanceof EnemyClass) {
    // Remove current player
    await updateMenu("enemy", true);
    await enemyTurn(turnOrder[0] as Enemy);
  }

  //* EMITTER FUNCTIONS ===============================================================================

  // On player action
  game.emitter.on("playerAction", onPlayerAction);
  // On player action done evaluating
  game.emitter.on("playerActionComplete", onPlayerActionComplete);
  // On action message
  game.emitter.on("actionMessage", onActionMessage);
  // Skip current player
  game.emitter.on("skipPlayer", onSkipPlayer);
  // Flee from combat
  game.emitter.on("flee", onPlayerFlee);

  /** Skip the current player. */
  async function onSkipPlayer(args: { encounterId: number }) {
    const { encounterId } = args;
    if (encounterId !== encounter.id) return;

    if (!(turnOrder[0] instanceof PlayerClass)) return;

    nextTurn();
  }

  /** Send attack message when received. */
  async function onActionMessage(args: ActionMessageEmitter) {
    const { message, encounterId, data = {} } = args;
    if (encounterId !== encounter.id || !message) return;

    // Delete attack messages
    // if (encounter.lastAttackMessageId) {
    //   const lastMessage = await channel.messages.fetch(encounter.lastAttackMessageId);

    //   setTimeout(async () => {
    //     try {
    //       await lastMessage.delete();
    //     } catch (err) {}
    //   }, 10000);
    // }

    // Attach status effect button
    let buttons: Button[] = [];
    let row = {};
    if (data.statusEffect) {
      buttons = [
        {
          id: "status_effect",
          emoji: emojis.question_mark,
          function: async (r) => {
            await r.edit({
              content: `${r.content}\n## ${data.statusEffect.getEmoji()}${game.titleCase(
                data.statusEffect.name
              )}\n${data.statusEffect.getInfo()}`,
              components: [],
            });
          },
          stop: true,
        },
      ];
      row = game.actionRow("buttons", buttons);
    }

    // Send message
    const botMsg = await game.send({
      player: players[0],
      reply: false,
      content: message,
      files: [{ attachment: "./assets/seperator.png", name: "seperator.png" }],
      components: _.isEmpty(buttons) ? [] : [row],
    });

    // Attach collector
    if (!_.isEmpty(buttons)) {
      game.componentCollector({
        components: buttons,
        botMessage: botMsg,
        player: menu.player,
      });
    }

    try {
      encounter = await prisma.encounter.update({
        where: { id: encounter.id },
        data: { lastActionMessageId: botMsg.id },
        include: { players: true, enemies: true },
      });
    } catch (err) {}
  }

  /** Function called by emitter when a player action is done evaluating. */
  async function onPlayerActionComplete(args: PlayerActionCompleteEmitter) {
    const { enemies = [], players = [], player } = args;
    if (args.encounterId !== encounter.id) return;

    // Evaluate end of turn status effects
    await player.evaluateStatusEffects({ enemies, players, currently: "turn_end" });

    // Update turnorder data
    updateTurnOrderList({ enemies, players });

    // Initiate next turn
    await nextTurn();
  }

  /** Function called when the player initiates an action. */
  async function onPlayerAction(args: PlayerActionEmitter) {
    const { player } = args;
    if (args.encounterId !== encounter.id) return;

    // Prevent the player from taking further actions
    encounter = await prisma.encounter.upsert({
      where: { id: encounter.id },
      update: { currentPlayer: null },
      create: {},
      include: { players: true, enemies: true },
    });

    await menu.switchBoard("no_input");
  }

  /** On player flee. */
  async function onPlayerFlee(args: PlayerFleeEmitter) {
    const { player } = args;
    if (args.encounterId !== encounter.id) return;
    await exitCombat("fleeing");
  }

  //* MAIN FUNCTIONS ===============================================================================

  /** Initiate the next turn. */
  async function nextTurn() {
    // Clear encounter image
    menu.variables.encounterImage = undefined;

    // Update the turn order
    const turnOrder = await game.updateTurnOrder(menu.variables.turnOrder);

    menu.variables.turnOrder = turnOrder;
    menu.variables.targets = [];
    menu.variables.enemies = turnOrder.filter((x) => !x.isPlayer) as Enemy[];
    menu.variables.players = turnOrder.filter((x) => x.isPlayer) as Player[];
    const nextEntity = turnOrder[0];

    // Exit combat if all players or enemies are dead
    if (menu.variables.players.every((x) => x.dead)) return exitCombat("allPlayersDead");
    if (menu.variables.enemies.every((x) => x.dead)) return exitCombat("allEnemiesDead");

    // Handle player
    if (nextEntity instanceof PlayerClass) {
      // Evaluate start of turn
      const player = await nextEntity.evaluateTurnStart({
        players: menu.variables.players,
        enemies: menu.variables.enemies,
      });

      // Skip player if dead
      if (player.dead) {
        return nextTurn();
      }

      menu.player = player;
      // Update current player
      await prisma.encounter.update({
        where: { id: encounter.id },
        data: { currentPlayer: player.id },
      });
      // Refresh menu
      await updateMenu("player");
    }
    // Handle enemy
    else if (nextEntity instanceof EnemyClass) {
      const enemy = await nextEntity.evaluateTurnStart();

      // Skip enemy if dead
      if (enemy.dead) {
        return nextTurn();
      }

      // Remove current player
      await prisma.encounter.update({ where: { id: encounter.id }, data: { currentPlayer: null } });
      // Refresh menu
      await updateMenu("enemy");
      // Execute enemy turn
      await enemyTurn(enemy);
    }
  }

  /** Execute an enemy's turn. */
  async function enemyTurn(enemy: Enemy) {
    // Send typing indicator
    await channel.sendTyping();
    setTimeout(async () => {
      // Update status effect durations
      enemy = await enemy.update({
        statusEffects: {
          updateMany: {
            where: { remDuration: { gt: 0 } },
            data: { remDuration: { increment: -1 } },
          },
        },
      });
      // Delete status effects with 0 remaining duration
      if (enemy.statusEffects.some((x) => x?.remDuration < 1)) {
        enemy = await enemy.update({
          statusEffects: {
            deleteMany: {
              id: { in: enemy.statusEffects.filter((x) => x?.remDuration < 1).map((x) => x.id) },
            },
          },
        });
      }

      // Evaluate status effects
      await enemy.evaluateStatusEffects({
        currently: "turn_start",
        enemies: menu.variables.enemies,
        players: menu.variables.players,
      });
      if (enemy.dead) return await nextTurn();

      // Get player
      let player = enemy.getTargetPlayer(menu.variables.players);
      // Get evaluated attack
      const action = await enemy.getStrongestAction({ player, players: menu.variables.players });
      // Evaluate action
      const { players, enemies } = await game.evaluateAction({
        enemies: menu.variables.enemies,
        players: menu.variables.players,
        source: enemy,
        targets: { 1: player },
        action,
      });

      // Update action cooldowns
      if (action.cooldown) {
        await prisma.enemyAction.update({
          where: { enemyId_name: { name: action.name, enemyId: enemy.id } },
          data: { remCooldown: action.cooldown + 1 },
        });
      }

      // Update the turn order
      updateTurnOrderList({ players, enemies });

      // Send player death message
      for (const player of players) {
        if (player.dead && menu.variables.players.length > 1) {
          const deathMessage = `## :skull: ${player.ping} **has died!**`;
          await game.send({ player, content: deathMessage, reply: false });
        }
      }

      // Evaluate status effects
      await enemy.evaluateStatusEffects({
        currently: "turn_end",
        enemies: menu.variables.enemies,
        players: menu.variables.players,
      });

      // Next turn
      await nextTurn();
    }, game.random(10, 20) * 100);
  }

  /** Exit combat. */
  async function exitCombat(reason: "allPlayersDead" | "allEnemiesDead" | "fleeing") {
    // Kill all emitters
    game.emitter.removeListener("playerActionComplete", onPlayerActionComplete);
    game.emitter.removeListener("actionMessage", onActionMessage);
    game.emitter.removeListener("skipPlayer", onSkipPlayer);
    game.emitter.removeListener("onPlayerFlee", onPlayerFlee);
    game.emitter.removeListener("playerAction", onPlayerAction);

    // Delete messages
    // setTimeout(async () => {
    //   try {
    //     menu.botMessage.delete();
    //     const lastMessage = await channel.messages.fetch(encounter.lastActionMessageId);
    //     lastMessage.delete();
    //   } catch (err) {}
    // }, 10000);

    // Switch to end board
    menu.switchBoard("end");

    // Delete encounter and enemies()
    await killEncounter();

    let players = menu.variables.players;
    let playerLoot: Item[][] = [];
    let playerXP: number[] = [];
    const { star, red_x, mark } = config.emojis;

    // Update players
    for (const [i, player] of players.entries()) {
      // Kill player
      if (player.dead) {
        const { marks, region, newPlayer } = await player.die();
        players[i] = newPlayer;
      }
      // Give loot from dead enemies
      if (reason == "allEnemiesDead" || reason == "fleeing") {
        const { xp, loot } = await player.giveEnemyRewards({ enemies: menu.variables.enemies });
        playerLoot[i] = loot;
        playerXP[i] = xp;
      }
      // Delete status effects and update action cooldowns
      await player.update({
        statusEffects: { deleteMany: {} },
        actions: { updateMany: { where: { remCooldown: { gt: 0 } }, data: { remCooldown: 0 } } },
      });
    }

    // Send failure message
    if (reason == "allPlayersDead") {
      let description = `# ${red_x} Encounter Failed ${red_x}`;
      // Solo
      if (players.length < 2) {
        const player = players[0];
        description += `\nYou have died...\n${f(`-50%`)} ${mark} (Remaining: ${f(
          player.marks
        )})\nReturned to ${f(player.region)}`;
      }
      // With party
      else {
        description += `\nAll players have died...\nAll players ${f(`-50%`)} ${mark}`;
        for (const player of players) {
          description += `\n${player.ping} returned to ${f(player.region)}`;
        }
      }
      const botMessage = await game.fastEmbed({
        description,
        pingParty: true,
        player: menu.player,
        color: "red",
      });
      if (players.length < 2) {
        await game.commandButton({
          player: players[0],
          botMessage,
          commands: [{ name: "explore" }],
        });
      }
    }

    // Send success message
    else if (reason == "allEnemiesDead") {
      let description = `# ${star} Victory ${star}`;
      // Add reward info for solo
      if (players.length < 2) {
        for (const loot of playerLoot[0] as Item[]) {
          description += `\n${f("+" + loot.quantity)} **${loot.getName()}** ${loot.getEmoji()}`;
        }
        description += `\n${f("+" + playerXP[0])} **XP** (${f(
          players[0].remainingXp - playerXP[0]
        )} until next level)`;
      }
      const botMessage = await game.fastEmbed({
        description,
        pingParty: true,
        reply: false,
        player: players[0],
        color: "gold",
      });
      if (players.length < 2) {
        await game.commandButton({
          player: players[0],
          botMessage,
          commands: [{ name: "explore" }],
        });
      }

      // Send individiual reward messages
      if (players.length > 1) {
        for (const [i, player] of players.entries()) {
          const title = `${player.user.username}'s Loot`;
          let description = ``;
          for (const loot of playerLoot[i] as Item[]) {
            description += `\n${f("+" + loot.quantity)} **${loot.getName()}** ${loot.getEmoji()}`;
          }
          description += `\n${f("+" + playerXP[i])} **XP** (${f(
            player.remainingXp - playerXP[i]
          )} until next level)`;
          await game.fastEmbed({
            description,
            title,
            ping: true,
            color: "gold",
            player,
            reply: false,
            thumbnail: player.user.pfp,
          });
        }
      }
    }

    // Send flee message
    else if (reason == "fleeing") {
      let description = `# 💨 You fled from the encounter! 💨`;
      // Add reward info for solo
      if (players.length < 2) {
        for (const loot of playerLoot[0] as Item[]) {
          description += `\n${f("+" + loot.quantity)} **${loot.getName()}** ${loot.getEmoji()}`;
        }
        description += `\n${f("+" + playerXP[0])} **XP** (${f(
          players[0].remainingXp - playerXP[0]
        )} until next level)`;
      }
      const botMessage = await game.fastEmbed({
        description,
        pingParty: true,
        reply: false,
        player: players[0],
        color: "orange",
      });
      if (players.length < 2) {
        await game.commandButton({
          player: players[0],
          botMessage,
          commands: [{ name: "explore" }],
        });
      }

      // Send individiual reward messages
      if (players.length > 1) {
        for (const [i, player] of players.entries()) {
          if (_.isEmpty(playerLoot[i]) && _.isEmpty(playerXP[i])) continue;
          const title = `${player.user.username}'s Loot`;
          let description = ``;
          for (const loot of playerLoot[i] as Item[]) {
            description += `\n${f("+" + loot.quantity)} **${loot.getName()}** ${loot.getEmoji()}`;
          }
          description += `\n${f("+" + playerXP[i])} **XP** (${f(
            player.remainingXp - playerXP[i]
          )} until next level)`;
          await game.fastEmbed({
            description,
            title,
            ping: true,
            color: "orange",
            player,
            reply: false,
            thumbnail: player.user.pfp,
          });
        }
      }
    }

    // Give player XP
    for (const [i, player] of players.entries()) {
      if (playerXP[i]) await player.giveXP({ amount: playerXP[i], message: menu.botMessage });
    }
  }

  /** Update or initialise the encounter menu. */
  async function updateMenu(next: "enemy" | "player", init: boolean = false) {
    const menuFunction = init ? "init" : "switchBoard";

    // Player
    if (next == "player") {
      // Define board
      let board = "main";

      // Define collector filter
      const filter = (i: Interaction) => {
        return i.user.id == menu.player.user.discordId;
      };

      // Re-send encounter menu
      if (menu.botMessage) {
        try {
          await menu.botMessage.delete();
          menu.botMessage = undefined;
        } catch (err) {
          throw game.error({
            content: `Failed to reinitialize encounter message.`,
            player: menu.player,
          });
        }
      }
      await menu.init(board, {
        filter,
      });
    }
    // Enemy
    else if (next == "enemy") {
      await menu[menuFunction]("no_input");
    }
  }

  /** Update the turn order given an array of enemies or players. */
  function updateTurnOrderList(args: { enemies?: Enemy[]; players: Player[] }) {
    const { enemies = [], players = [] } = args;

    menu.variables.turnOrder = menu.variables.turnOrder.map((entity) => {
      if (entity instanceof EnemyClass) {
        return enemies.find((x) => x.id == entity.id) || entity;
      } else if (entity instanceof PlayerClass) {
        return players.find((x) => x.id == entity.id) || entity;
      }
    });
  }

  /** Delete the encounter and all enemies. */
  async function killEncounter() {
    // Delete encounter
    await prisma.encounter.delete({ where: { id: encounter.id } });

    // Delete all enemies
    const enemiesRemaining = menu ? menu?.variables?.enemies : enemies;
    await prisma.enemy.deleteMany({
      where: {
        OR: enemiesRemaining.map((x) => {
          return { id: x.id };
        }),
      },
    });

    return;
  }

  /** Get menu for selecting targets. */
  async function getSelectTargetMenu(m: Menu<typeof variables>, total: number = 1) {
    const targets = m.variables.targets;
    let placeholder = "Select a target...";
    // Change text depending on target number
    switch (targets.length) {
      case 1:
        placeholder = "Select 2nd target...";
        break;
      case 2:
        placeholder = "Select 3rd target...";
        break;
      case 3:
        placeholder = "Select 4th target...";
        break;
    }

    // Return with menu
    return {
      id: "selectEnemy",
      placeholder,
      options: m.variables.enemies
        .sort((a, b) => a.number - b.number)
        .filter((x) => !x.dead)
        .map((x) => {
          return {
            label: x.displayName,
            value: x.number.toString(),
            default: total > 1 ? false : targets[0] == x.number ? true : false,
            emoji: x.getEmoji(),
          };
        }),
      function: async (r, i, s) => {
        m.variables.encounterImage = undefined;

        // Define first target
        if (total <= 1) {
          m.variables.targets = [parseInt(s)];
        }
        // Push new target
        else {
          m.variables.targets.push(parseInt(s));
        }
        // Finished selecting all required targets
        if (m.variables.targets.length == total) {
          // Perform weapon attack
          if (m.variables.pendingAction.type == "weapon_attack") {
            await game.runCommand("attack", {
              message: m.botMessage,
              discordId: m.player.user.discordId,
              server: m.player.server,
              args: [m.variables.pendingAction.name, ...m.variables.targets.map(String)],
            });
          }
        }
        // More targets remaining to select
        else {
          await m.refresh();
        }
      },
    };
  }

  /** Get enemies that are still alive. */
  function getAliveEnemies() {
    return menu.variables.enemies.filter((x) => !x.dead);
  }
}

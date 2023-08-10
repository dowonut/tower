import { Interaction, TextChannel } from "discord.js";
import { game, prisma, config } from "../../../tower.js";
import { f } from "../index.js";

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

  const firstPlayer: Player = game.getNextPlayer(turnOrder);

  // Create menu
  const menu = new game.Menu({
    player: firstPlayer,
    variables: {
      players,
      enemies,
      turnOrder,
      selectedEnemy: undefined as number,
    },
    boards: [
      { name: "main", rows: ["enemies", "actions"], message: "main" },
      {
        name: "enemySelected",
        rows: ["enemies", "enemyActions", "actions"],
        message: "main",
      },
      {
        name: "selectAttack",
        rows: ["enemies", "attacks"],
      },
      {
        name: "enemyTurn",
        rows: [],
        message: "main",
      },
    ],
    rows: [
      // Select enemy
      {
        name: "enemies",
        type: "menu",
        components: (m) => {
          const enemies = m.variables.enemies;
          const selected = m.variables.selectedEnemy;
          return {
            id: "selectEnemy",
            placeholder: "Select an enemy for more options...",
            options: enemies.map((x) => {
              return {
                label: x.displayName,
                value: x.number.toString(),
                default: selected == x.number ? true : false,
              };
            }),
            function: (r, i, s) => {
              m.variables.selectedEnemy = parseInt(s);
              m.switchBoard("enemySelected");
            },
          };
        },
      },
      // Non-combat actions
      {
        name: "actions",
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
      // Enemy-related actions
      {
        name: "enemyActions",
        type: "buttons",
        components: (m) => {
          return [
            {
              id: "attack",
              label: "Attack",
              style: "primary",
              emoji: config.emojis.weapons.sword,
              board: "selectAttack",
            },
            {
              id: "magic",
              label: "Magic",
              style: "primary",
              emoji: config.emojis.magic,
              function() {},
            },
            {
              id: "other",
              label: "Other",
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
          const attacks = await m.player.getAttacks({ onlyAvailable: true });
          if (!attacks[0])
            return [
              { id: "noAttacks", label: "No attacks available...", disable: true },
              { id: "return", board: "enemySelected" },
            ];
          return attacks.map((x) => {
            return {
              id: x.name,
              label: `${x.getName()}` + (x.remCooldown ? ` (${x.remCooldown})` : ""),
              style: "success",
              stop: true,
              emoji: x.getEmoji(),
              async function() {
                // Attack
                await game.runCommand("attack", {
                  message: m.botMessage,
                  discordId: m.player.user.discordId,
                  server: m.player.server,
                  args: [x.name, m.variables.selectedEnemy.toString()],
                });
              },
            };
          });
        },
      },
    ],
    messages: [
      // Main combat embed
      {
        name: "main",
        function: async (m) => {
          const enemies = m.variables.enemies;
          const players = m.variables.players;
          const partyName = players.length > 1 ? "Party" : `${players[0].user.username}`;
          const title = `${partyName} fighting ${enemies.map((x) => x.getName()).join(", ")}`;

          // Format enemy list
          let description = ``;
          for (const enemy of enemies) {
            const enemyName = enemies.length > 1 ? `**${enemy.displayName}** | ` : ``;
            const healthBar = game.fastProgressBar("health", enemy);
            description += `
${enemyName}${healthBar}
`;
          }

          // Get enemy image
          let image = enemies.length == 1 ? enemies[0].getImage() : undefined;

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
            thumbnail: image ? `attachment://${image.name}` : null,
            files: image ? [image] : [],
            pingParty: true,
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
        data: { discordMessageId: menu.botMessage?.id, discordChannelId: menu.botMessage?.channelId },
        include: { players: true, enemies: true },
      });
    },
  });

  // Initiate encounter message
  // If player
  if (turnOrder[0].isPlayer) {
    await updateMenu("player", true);
  }
  // If enemy
  else {
    // Remove current player
    await prisma.encounter.update({ where: { id: encounter.id }, data: { currentPlayer: null } });
    await updateMenu("enemy", true);
    await enemyTurn(turnOrder[0] as Enemy);
  }

  // On player move
  game.emitter.on("playerMove", async (args: EmitterArgs) => {
    if (args.encounterId !== encounter.id) return;
    const { attackMessage } = args;

    // Send and store attack message
    if (attackMessage) {
      await sendAttackMessage(attackMessage);
    }

    // Initiate next turn
    await nextTurn();
  });

  // FUNCTIONS ===============================================================================

  /** Initiate the next turn. */
  async function nextTurn() {
    const turnOrder = await game.updateTurnOrder(menu.variables.turnOrder);
    menu.variables.turnOrder = turnOrder;
    menu.variables.selectedEnemy = undefined;
    menu.variables.enemies = turnOrder.filter((x) => !x.isPlayer) as Enemy[];
    menu.variables.players = turnOrder.filter((x) => x.isPlayer) as Player[];
    const nextEntity = turnOrder[0];

    // Exit combat if all players or enemies are dead
    if (menu.variables.players.every((x) => x.dead)) return exitCombat("allPlayersDead");
    if (menu.variables.enemies.every((x) => x.dead)) return exitCombat("allEnemiesDead");

    // Handle player
    if (nextEntity.isPlayer) {
      const player = nextEntity as Player;

      // Skip player if dead
      if (player.dead) {
        return nextTurn();
      }

      menu.player = player;
      // Update current player
      await prisma.encounter.update({ where: { id: encounter.id }, data: { currentPlayer: player.id } });
      // Refresh menu
      await updateMenu("player");
    }
    // Handle enemy
    else {
      const enemy = nextEntity as Enemy;

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
      // Get player
      let player = enemy.getTargetPlayer(menu.variables.players);
      // Get evaluated attack
      const attack = await enemy.getBestAttack(player);
      const previousPlayerHealth = player.health;

      // Update player
      const dead = player.health - attack.damage < 1 ? true : false;
      player = await player.update({ health: { increment: -attack.damage }, dead });

      // Send attack message
      const attackMessage = game.getAttackMessage({
        source: "enemy",
        player,
        enemy,
        attack,
        previousHealth: previousPlayerHealth,
      });
      await sendAttackMessage(attackMessage);

      // Send player death message
      if (dead && menu.variables.players.length > 1) {
        const deathMessage = `:skull: ${player.ping} **has died!**`;
        await game.send({ player, content: deathMessage, reply: true });
      }

      // Next turn
      await nextTurn();
    }, game.random(2, 5) * 1000);
  }

  /** Exit combat. */
  async function exitCombat(reason: "allPlayersDead" | "allEnemiesDead") {
    // Delete messages
    setTimeout(async () => {
      try {
        menu.botMessage.delete();
        const lastMessage = await channel.messages.fetch(encounter.lastAttackMessageId);
        lastMessage.delete();
      } catch (err) {}
    }, 10000);

    // Delete encounter
    await prisma.encounter.delete({ where: { id: encounter.id } });

    // Delete all enemies
    prisma.enemy.deleteMany({
      where: {
        OR: menu.variables.enemies.map((x) => {
          return { id: x.id };
        }),
      },
    });

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
      if (reason == "allEnemiesDead") {
        const { xp, loot } = await player.giveEnemyLoot({ enemies: menu.variables.enemies });
        playerLoot[i] = loot;
        playerXP[i] = xp;
      }
    }

    // Send failure message
    if (reason == "allPlayersDead") {
      let description = `# ${red_x} Encounter Failed ${red_x}`;
      // Solo
      if (players.length < 2) {
        const player = players[0];
        description += `\nYou have died...\n${f(`-20%`)} ${mark} (Remaining: ${f(player.marks)})\nReturned to ${f(
          player.region
        )}`;
      }
      // With party
      else {
        description += `\nAll players have died...\nAll players ${f(`-20%`)} ${mark}`;
        for (const player of players) {
          description += `\n${player.ping} returned to ${f(player.region)}`;
        }
      }
      const botMessage = await game.fastEmbed({ description, pingParty: true, player: menu.player, color: "red" });
      if (players.length < 2) {
        await game.commandButton({ player: players[0], botMessage, commands: [{ name: "explore" }] });
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
        description += `\n${f("+" + playerXP[0])} **XP**`;
      }
      const botMessage = await game.fastEmbed({
        description,
        pingParty: true,
        reply: false,
        player: players[0],
        color: "gold",
      });
      if (players.length < 2) {
        await game.commandButton({ player: players[0], botMessage, commands: [{ name: "explore" }] });
      }

      // Send individiual reward messages
      if (players.length > 1) {
        for (const [i, player] of players.entries()) {
          const title = `${player.user.username}'s Loot`;
          let description = ``;
          for (const loot of playerLoot[i] as Item[]) {
            description += `\n${f("+" + loot.quantity)} **${loot.getName()}** ${loot.getEmoji()}`;
          }
          description += `\n${f("+" + playerXP[i])} **XP**`;
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

    // Give player XP
    for (const [i, player] of players.entries()) {
      console.log("health: ", player.health);
      if (playerXP[i]) await player.giveXP({ amount: playerXP[i], message: menu.botMessage });
    }
  }

  /** Send or update last attack message. */
  async function sendAttackMessage(message: string) {
    if (encounter.lastAttackMessageId) {
      const lastMessage = await channel.messages.fetch(encounter.lastAttackMessageId);

      setTimeout(async () => {
        try {
          await lastMessage.delete();
        } catch (err) {}
      }, 10000);
    }

    const botMsg = await game.send({ player: players[0], reply: false, content: message });
    encounter = await prisma.encounter.update({
      where: { id: encounter.id },
      data: { lastAttackMessageId: botMsg.id },
      include: { players: true, enemies: true },
    });
  }

  /** Update or initialise the encounter menu. */
  async function updateMenu(next: "enemy" | "player", init: boolean = false) {
    const menuFunction = init ? "init" : "switchBoard";

    // Player
    if (next == "player") {
      // Define board
      let board = "main";
      if (menu.variables.enemies.length < 2) {
        board = "enemySelected";
        menu.variables.selectedEnemy = menu.variables.enemies[0].number;
      }

      // Define collector filter
      const filter = (i: Interaction) => {
        return i.user.id == menu.player.user.discordId;
      };

      // Update/create menu
      await menu[menuFunction](board, {
        filter,
      });
    }
    // Enemy
    else if (next == "enemy") {
      await menu[menuFunction]("enemyTurn");
    }
  }
}

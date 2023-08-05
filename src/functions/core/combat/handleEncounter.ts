import { TextChannel } from "discord.js";
import { game, prisma, config } from "../../../tower.js";

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

  const firstPlayer: Player = game.getNextPlayer(turnOrder);

  // Create menu
  const menu = new game.Menu({
    channel,
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
        message: "main",
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
                const response = await game.runCommand("flee", {
                  discordId: i.user.id,
                  message: m.botMessage,
                  server: m.player.server,
                });
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
              emoji: config.emojis.traits.strength,
              board: "selectAttack",
            },
            {
              id: "magic",
              label: "Magic",
              style: "primary",
              emoji: config.emojis.traits.arcane,
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

          const partyPing = m.variables.players.map((x) => x.ping).join(" ");

          // Return with message
          return game.fastEmbed({
            message: m.botMessage,
            player: m.player,
            title,
            description,
            fullSend: false,
            reply: false,
            thumbnail: image ? `attachment://${image.name}` : null,
            files: image ? [image] : [],
            content: partyPing,
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
    await menu.init("main", {
      filter: (i) => {
        return i.user.id == game.getNextPlayer(turnOrder).user.discordId;
      },
    });
  }
  // If enemy
  else {
    // Remove current player
    await prisma.encounter.update({ where: { id: encounter.id }, data: { currentPlayer: null } });
    await menu.init("enemyTurn");
    await enemyTurn(turnOrder[0] as Enemy);
  }

  // On player move
  game.emitter.on("playerMove", (args: EmitterArgs) => {
    if (args.encounterId !== encounter.id) return;

    // Initiate next turn
    nextTurn();
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

      menu.switchBoard("main", {
        filter: (i) => {
          return i.user.id == player.user.discordId;
        },
      });
    }
    // Handle enemy
    else {
      const enemy = nextEntity as Enemy;
      // Remove current player
      await prisma.encounter.update({ where: { id: encounter.id }, data: { currentPlayer: null } });
      menu.switchBoard("enemyTurn");
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
      await game.send({ channel, reply: false, content: attackMessage });

      // Next turn
      nextTurn();
    }, game.random(2, 5) * 1000);
  }

  /** Exit combat. */
  async function exitCombat(reason: "allPlayersDead" | "allEnemiesDead") {
    console.log(reason);
    try {
      menu.botMessage.delete();
    } catch (err) {}
    await prisma.encounter.delete({ where: { id: encounter.id } });

    // Delete all enemies
    prisma.enemy.deleteMany({
      where: {
        OR: menu.variables.enemies.map((x) => {
          return { id: x.id };
        }),
      },
    });

    // Update players
    for (const player of menu.variables.players) {
      // Kill player
      if (player.dead) {
        const { marks, region } = await player.die();
        const { mark } = config.emojis;

        const deathMessage = `
:skull_crossbones: ${
          player.ping
        } **you died!** :skull_crossbones:\n\`-20%\` ${mark} (Remaining: \`${marks}\`)\nReturned to \`${game.titleCase(
          region
        )}\``;

        game.send({ channel, content: deathMessage, reply: true });
      }
    }
  }
}

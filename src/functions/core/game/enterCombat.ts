import { config, game, prisma } from "../../../tower.js";

/** Enter a combat encounter with an enemy. */
export default async function enterCombat(args: { player: Player; enemies: Enemy[]; message: Message }) {
  const { player, message } = args;
  let { enemies } = args;

  // Handle party
  let players: Player[] = [player];
  if (player.party) {
    // If not leader
    if (!player.isPartyLeader) {
      return game.error({
        message,
        content: `only the party leader can initiate a combat encounter.`,
      });
    }

    // Get players from party
    for (const newPlayer of player.party.players) {
      // Check if leader
      if (newPlayer.id == player.id) continue;
      // Get player
      const invitee = await game.getPlayer({
        discordId: newPlayer.user.discordId,
        server: player.server,
      });
      // If player doesn't exist
      if (!invitee) {
        return game.error({
          message,
          content: `something went wrong trying to find <@${newPlayer.user.discordId}>`,
        });
      }
      // If player is already in combat
      if (invitee.inCombat) {
        return game.error({
          message,
          content: `can't start encounter because ${invitee.ping} is already in combat.`,
        });
      }
      // If player is on a different floor
      if (invitee.floor !== player.floor) {
        return game.error({
          message,
          content: `can't start encounter because ${invitee.ping} is on a different floor than the party leader.`,
        });
      }
      // Add player to list
      players.push(invitee);
    }
  }

  // Create enemies in database
  let enemyNumber = 1;
  for (const [i, enemy] of enemies.entries()) {
    const SV = enemy.baseSV;
    const enemyData = await prisma.enemy.create({
      data: {
        name: enemy.name,
        health: enemy.maxHP,
        SV,
        number: enemyNumber,
      },
    });
    enemies[i] = game.createClassObject(enemy, enemyData);
    enemyNumber++;
  }

  // Set starting SV for players
  for (const [i, player] of players.entries()) {
    const SV = player.baseSV;
    players[i] = await player.update({ SV });
  }

  let turnOrder = game.getTurnOrder({ players, enemies });
  turnOrder = await updateTurnOrder(turnOrder);
  const firstPlayer: Player = getNextPlayer(turnOrder);

  // console.log(
  //   turnOrder.map((x) => {
  //     return { id: x.id, SV: x.SV, isPlayer: x.isPlayer };
  //   })
  // );

  // Create new encounter
  const enemyIds = enemies.map((x) => {
    return { id: x.id };
  });
  const playerIds = players.map((x) => {
    return { id: x.id };
  });
  const encounter = await prisma.encounter.create({
    data: {
      enemies: { connect: enemyIds },
      players: { connect: playerIds },
      currentPlayer: firstPlayer.id,
    },
  });

  // Create menu
  const menu = new game.Menu({
    player: firstPlayer,
    message,
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
                  server: player.server,
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
              async function() {
                // Attack
                await game.runCommand("attack", {
                  message: m.message,
                  discordId: m.player.user.discordId,
                  server: m.player.server,
                  args: [x.name, m.variables.selectedEnemy.toString()],
                });
                nextTurn();
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
            const name = entity.isPlayer
              ? `\u001b[1;2;37m${entity.displayName}\u001b[0m`
              : `\u001b[1;2;31m${entity.displayName}\u001b[0m`;
            turnOrderList += `${current}${name}\n`;
            i++;
          }
          description += `\`\`\`ansi
${turnOrderList}
\`\`\``;

          // Return with message
          return game.fastEmbed({
            message,
            player,
            title,
            description,
            fullSend: false,
            reply: false,
            thumbnail: image ? `attachment://${image.name}` : null,
            files: image ? [image] : [],
          });
        },
      },
      // Specific enemy info
      {
        name: "info",
        function: async (m) =>
          await game.enemyInfo({
            message,
            player,
            verbose: false,
            enemyData: enemies[0],
          }),
      },
    ],
  });

  menu.init("main", {
    filter: (i) => {
      return i.user.id == getNextPlayer(turnOrder).user.discordId;
    },
  });

  // FUNCTIONS ===============================================================================

  /** Initiate the next turn. */
  async function nextTurn() {
    const turnOrder = await updateTurnOrder(menu.variables.turnOrder);
    menu.variables.turnOrder = turnOrder;
    menu.variables.selectedEnemy = undefined;
    const nextEntity = turnOrder[0];

    // Handle enemy
    if (nextEntity.isPlayer) {
      const player = nextEntity as Player;
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

      // Update current player
      await prisma.encounter.update({ where: { id: encounter.id }, data: { currentPlayer: null } });

      menu.switchBoard("enemyTurn");
    }
  }

  /** Update the turn order */
  async function updateTurnOrder(turnOrder: (Player | Enemy)[]) {
    // Update turn order
    if (turnOrder[0].SV == 0) {
      turnOrder[0] = await (turnOrder[0] as Player).update({ SV: turnOrder[0].baseSV });
      turnOrder = game.getTurnOrder({ entities: turnOrder });
    }

    const decreaseSV = turnOrder[0].SV;
    // Update Speed Value
    if (decreaseSV > 0) {
      for (const [i, entity] of turnOrder.entries()) {
        turnOrder[i] = await (entity as Player).update({ SV: { increment: -decreaseSV } });
      }
    }

    return turnOrder;
  }

  /** Get next entity in turn order. */
  function getNextPlayer(turnOrder: (Player | Enemy)[]) {
    return turnOrder.find((x) => x.isPlayer) as Player;
  }
}

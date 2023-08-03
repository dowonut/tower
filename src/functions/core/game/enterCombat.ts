import { game, prisma } from "../../../tower.js";

/** Enter a combat encounter with an enemy. */
export default async function enterCombat(args: {
  player: Player;
  enemies: Enemy[];
  message: Message;
}) {
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
  for (let enemy of enemies) {
    const SV = enemy.baseSV;
    const enemyData = await prisma.enemy.create({
      data: {
        name: enemy.name,
        health: enemy.maxHP,
        SV,
        number: enemyNumber,
      },
    });
    enemy = game.createClassObject<Enemy>(enemy, enemyData);
    enemyNumber++;
  }

  // Create new encounter
  const enemyIds = enemies.map((x) => {
    return { id: x.id };
  });
  const playerIds = players.map((x) => {
    return { id: x.id };
  });
  const encounter = await prisma.encounter.create({
    data: { enemies: { connect: enemyIds }, players: { connect: playerIds } },
  });

  // Calculate starting SV
  for (let player of players) {
    const SV = player.baseSV;
    player = await player.update({ SV });
  }

  const turnOrder: (Player | Enemy)[] = getTurnOrder(players, enemies);

  // console.log(
  //   turnOrder.map((x) => {
  //     return { id: x.id, type: "user" in x ? "player" : "enemy", SV: x.SV };
  //   })
  // );

  // Create menu
  const menu = new game.Menu({
    player,
    message,
    variables: {
      players,
      enemies,
      turnOrder,
      currentPlayer: turnOrder.filter((x) => x.isPlayer)[0] as Player,
      selectedEnemy: undefined as number,
    },
    boards: [
      { name: "main", rows: ["enemies", "actions"], message: "main" },
      {
        name: "enemySelected",
        rows: ["enemies", "enemyActions", "actions"],
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
                value: x.id.toString(),
                default: selected == x.id ? true : false,
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
              emoji: "⚔️",
              function: () => {
                console.log("attack");
              },
            },
          ];
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
          const partyName =
            players.length > 1 ? "Party" : `${players[0].user.username}`;
          const title = `${partyName} fighting ${enemies
            .map((x) => x.getName())
            .join(", ")}`;

          // Format enemy list
          let description = ``;
          for (const enemy of enemies) {
            const enemyName =
              enemies.length > 1 ? `**${enemy.displayName}** | ` : ``;
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
      return (
        i.user.id ==
        (turnOrder.filter((x) => x.isPlayer)[0] as Player).user.discordId
      );
    },
  });
}

// FUNCTIONS ===============================================================================

// Get turn order based on current Speed Values
function getTurnOrder(players: Player[], enemies: Enemy[]) {
  const turnOrder: (Player | Enemy)[] = [...players, ...enemies].sort(
    (a, b) => {
      if (a.SV > b.SV) return 1;
      if (a.SV < b.SV) return -1;
      if (a.SPD < b.SPD) return 1;
      if (a.SPD > b.SPD) return -1;
      if (!("user" in a)) return 1;
      if ("user" in a) return -1;
    }
  );
  return turnOrder;
}

import { game, prisma } from "../../../tower.js";

/** Enter a combat encounter with an enemy. */
export default async function enterCombat(args: {
  player: Player;
  enemies: Enemy[];
  message: Message;
}) {
  const { player, enemies, message } = args;

  // Create enemies in database
  let enemiesData = [];
  for (const enemy of enemies) {
    const enemyData = await prisma.enemy.create({
      data: {
        name: enemy.name,
        health: enemy.maxHP,
      },
    });
    enemiesData.push(enemyData);
  }

  const players = [player];

  // Create new encounter
  const enemyIds = enemiesData.map((x) => {
    return { id: x.id };
  });
  const playerIds = players.map((x) => {
    return { id: x.id };
  });
  const encounter = await prisma.encounter.create({
    data: { enemies: { connect: enemyIds }, players: { connect: playerIds } },
  });

  // Create menu
  const menu = new game.Menu({
    player,
    message,
    boards: [{ name: "main", rows: [], message: "info" }],
    rows: [
      {
        name: "actions",
        type: "buttons",
        components: (m) => {
          return [];
        },
      },
    ],
    messages: [
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
}

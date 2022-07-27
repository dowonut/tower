import enemies from "../game/enemies.js";
import floors from "../game/floors.js";

export default {
  startEnemyEncounter: async (
    message,
    args,
    prisma,
    config,
    player,
    game,
    server
  ) => {
    // Choose random enemy from floor

    // Get all enemies on the current floor
    const floorEnemies = floors[player.floor - 1].enemies;

    // Get names and weights from enemies
    const enemyNames = floorEnemies.map((enemy) => enemy.name);
    const enemyWeights = floorEnemies.map((enemy) => enemy.weight);

    // Select enemy randomly based on weights
    const chosenEnemy = game.weightedRandom(enemyNames, enemyWeights);

    // Get data from chosen enemy
    const enemyData = enemies[chosenEnemy.item.toLowerCase()];

    // Create embed for start of encounter
    const embed = {
      thumbnail: {
        url: enemyData.image,
      },
      color: config.botColor,
      author: {
        name: `${enemyData.name} has appeared!`,
        icon_url: player.pfp,
      },
      description: `
      
What do you want to do?
\`${server.prefix}enemyinfo | ${server.prefix}attack | ${server.prefix}flee\`
            `,
    };

    // Send embed
    game.sendEmbed(message, embed);

    // Create enemy in database
    const enemy = await prisma.enemy.create({
      data: {
        name: enemyData.name,
        health: enemyData.maxHealth,
        fighting: player.discordId,
      },
    });

    await player.unlockCommands(message, server, [
      "attack",
      "enemyinfo",
      "flee",
      "status",
    ]);

    player.enterCombat(enemy);
  },
};

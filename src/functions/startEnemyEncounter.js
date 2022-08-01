import enemies from "../game/enemies.js";
import floors from "../game/floors.js";

export default {
  startEnemyEncounter: async (
    message,
    prisma,
    config,
    player,
    game,
    server
  ) => {
    // Get player region
    const region = player.getRegion();

    // Get all enemies on the current floor
    const floorEnemies = region.enemies;

    // Select enemy randomly based on weights
    const chosenEnemy = game.getWeightedArray(floorEnemies);

    // Get data from chosen enemy
    const enemyData = enemies.find(
      (x) => x.name == chosenEnemy.name.toLowerCase()
    );

    // Create embed for start of encounter
    const embed = {
      thumbnail: {
        url: enemyData.image,
      },
      color: config.botColor,
      author: {
        name: `${enemyData.getName()} has appeared!`,
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

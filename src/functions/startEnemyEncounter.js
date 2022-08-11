import enemies from "../game/classes/enemies.js";

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

    const image = enemyData.getImage();

    // Create embed for start of encounter
    let embed = {
      color: config.botColor,
      author: {
        name: `${enemyData.getName()} has appeared!`,
        icon_url: player.pfp,
      },
      description: `
\`[ LVL ${enemyData.level} | HP ${enemyData.maxHealth} ]\`  

\`${server.prefix}attack | ${server.prefix}flee | ${server.prefix}enemyinfo\`
            `,
    };

    if (image) embed.thumbnail = { url: `attachment://${image.name}` };

    // Send embed
    game.sendEmbed(message, embed, image);

    // Create enemy in database
    const enemy = await prisma.enemy.create({
      data: {
        name: enemyData.name,
        health: enemyData.maxHealth,
        fighting: player.discordId,
      },
    });

    await player.addExplore(
      message,
      server,
      "enemy",
      undefined,
      enemyData.name
    );

    await player.unlockCommands(message, server, [
      "attack",
      "flee",
      "enemyinfo",
      //"status",
    ]);

    player.enterCombat(enemy);
  },
};

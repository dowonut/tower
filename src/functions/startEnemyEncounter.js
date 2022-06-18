import enemies from "../game/enemies.js";

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
    // Choose random enemy
    const enemyNames = Object.keys(enemies);
    const selectEnemy =
      enemyNames[Math.floor(Math.random() * enemyNames.length)];

    const enemyData = enemies[selectEnemy];

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
\`${server.prefix}enemyinfo | ${server.prefix}attack | ${server.prefix}magic | ${server.prefix}flee\`
            `,
    };

    // Send embed
    game.sendEmbed(message, embed);

    // Create enemy in database
    const enemy = await prisma.enemy.create({
      data: {
        enemyType: enemyData.name,
        health: enemyData.maxHealth,
        fighting: player.discordId,
      },
    });

    player.enterCombat(enemy);
  },
};

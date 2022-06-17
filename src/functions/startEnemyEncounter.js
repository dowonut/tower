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
    // Create embed for start of encounter
    const embed = {
      color: config.botColor,
      author: {
        name: `An enemy has appeared!`,
        icon_url: player.pfp,
      },
      description: `
      
**\`[ Slime | 5 HP ]\`**
      
What do you want to do?
\`${server.prefix}enemyinfo | ${server.prefix}attack | ${server.prefix}magic | ${server.prefix}flee\`
            `,
    };

    // Send embed
    game.sendEmbed(message, embed);

    // Create enemy in database
    const enemy = await prisma.enemy.create({
      data: {
        enemyType: enemies.Slime.name,
        health: enemies.Slime.maxHealth,
        fighting: player.discordId,
      },
    });

    player.enterCombat(enemy);

    console.log(enemy);
  },
};

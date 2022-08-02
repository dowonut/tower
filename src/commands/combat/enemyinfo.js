export default {
  name: "enemyinfo",
  aliases: ["ei"],
  description: "Get information about an enemy during combat.",
  category: "Combat",
  useInCombatOnly: true,
  async execute(message, args, prisma, config, player, game, server) {
    const enemy = await player.getCurrentEnemy();

    const image = enemy.getImage();

    const embed = {
      color: config.botColor,
      author: {
        icon_url: player.pfp,
        name: enemy.getName() + ` (fighting ` + player.username + `)`,
      },
      description: `
*${enemy.description}*

${config.emojis.health} Health: \`${enemy.health} / ${enemy.maxHealth}\`

${config.emojis.stats.strength} Strength: \`${enemy.strength}\`
${config.emojis.stats.defence} Defence: \`${enemy.defence}\`
        `,
    };

    if (image) embed.thumbnail = { url: `attachment://${image.name}` };

    game.sendEmbed(message, embed, image);
  },
};

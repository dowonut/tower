export default {
  name: "enemyinfo",
  aliases: ["ei"],
  description: "Get information about an enemy during combat.",
  category: "Combat",
  useInCombatOnly: true,
  async execute(message, args, prisma, config, player, game, server) {
    const enemy = await player.getCurrentEnemy();

    const embed = {
      color: config.botColor,
      thumbnail: {
        url: enemy.image,
      },
      author: {
        icon_url: player.pfp,
        name: enemy.name + ` (fighting ` + player.username + `)`,
      },
      description: `
:drop_of_blood: Health: **\`${enemy.health} / ${enemy.maxHealth}\`**

:crossed_swords: Strength: **\`${enemy.strength}\`**
:shield: Defence: **\`${enemy.defence}\`**
        `,
    };

    game.sendEmbed(message, embed);
  },
};

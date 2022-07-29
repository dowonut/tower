export default {
  name: "status",
  aliases: ["st"],
  description: "Show your current status during combat.",
  category: "Combat",
  useInCombatOnly: true,
  async execute(message, args, prisma, config, player, game, server) {
    const enemy = await player.getCurrentEnemy();

    const embed = {
      color: config.botColor,
      author: {
        //icon_url: player.pfp,
        name: `${player.username} (fighting ${enemy.name})`,
      },
      thumbnail: {
        url: player.pfp,
      },
      description: `
:drop_of_blood: Health: **\`${player.health} / ${player.maxHealth}\`**
      `,
    };

    game.sendEmbed(message, embed);
  },
};

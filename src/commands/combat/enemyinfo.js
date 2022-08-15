export default {
  name: "enemyinfo",
  aliases: ["ei"],
  description: "Get information about an enemy during combat.",
  category: "Combat",
  useInCombatOnly: true,
  async execute(message, args, prisma, config, player, game, server) {
    const { embed, image } = await game.enemyInfo(config, player, game);

    game.fastEmbed(message, player, embed, embed.author.name, image);
  },
};

export default {
  name: "enemyinfo",
  aliases: ["ei"],
  description: "Get information about an enemy during combat.",
  category: "Combat",
  useInCombatOnly: true,
  async execute(message, args, config, player, server) {
    const { embed, image } = await game.enemyInfo(config, player);

    game.fastEmbed(message, player, embed, embed.author.name, image);
  },
};

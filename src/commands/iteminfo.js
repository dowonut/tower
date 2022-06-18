export default {
  name: "iteminfo",
  aliases: ["ii"],
  arguments: "<name of item>",
  description:
    "Use to get detailed information about an item in your inventory.",
  async execute(message, args, prisma, config, player, game, server) {
    if (!args[0]) return game.reply(message, "provide the name of an item.");
  },
};

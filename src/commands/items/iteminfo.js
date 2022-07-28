export default {
  name: "iteminfo",
  aliases: ["ii"],
  arguments: "<item name>",
  description: "Get detailed information about an item.",
  category: "Items",
  async execute(message, args, prisma, config, player, game, server) {
    if (!args[0]) return game.reply(message, "provide the name of an item.");

    const item = await player.getItem(args.join(" "));

    if (!item)
      return game.reply(
        message,
        `not a valid item. Check your items with \`${server.prefix}inventory\``
      );

    let description = `${item.info}`;

    if (item.health) {
      description += `\n\nCan be eaten to regain \`${item.health}\` :drop_of_blood:`;
    }

    if (item.value)
      description += `\n\nCan be sold to a merchant for \`${item.value}\` ${config.emojis.mark}`;

    const embed = {
      description,
      thumbnail: { url: item.image ? item.image : null },
    };

    game.fastEmbed(
      message,
      player,
      embed,
      `${item.name} ${item.quantity > 1 ? `(x${item.quantity})` : ``}`
    );

    player.unlockCommands(message, server, ["sell", "eat"]);
  },
};

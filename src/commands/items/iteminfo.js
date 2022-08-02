export default {
  name: "iteminfo",
  aliases: ["ii"],
  arguments: "<item name>",
  description: "Get detailed information about an item.",
  category: "Items",
  useInCombat: true,
  async execute(message, args, prisma, config, player, game, server) {
    if (!args[0]) return game.reply(message, "provide the name of an item.");

    // Get player item
    const item = await player.getItem(args.join(" "));

    // Check if item exists
    if (!item)
      return game.error(
        message,
        `not a valid item. Check your items with \`${server.prefix}inventory\``
      );

    // Format item description
    let description = `
*${item.info}*\n
Category: \`${game.titleCase(item.category)}\``;

    if (item.category == "weapon") {
      description += `\nWeapon Type: \`${game.titleCase(item.weaponType)}\``;
      description += `\nDamage: \`${item.damage.value}\`${
        config.emojis.damage[item.damage.type]
      }`;
    }

    // Check if item can be eaten
    if (item.health) {
      description += `\nCan be eaten to regain \`${item.health}\` ${config.emojis.health}`;
    }

    // Check if item can be sold
    if (item.value)
      description += `\nResell value: \`${item.value}\`${config.emojis.mark}`;

    let embed = {
      description,
    };

    // Get image
    const file = item.getImage();

    // Set embed thumbnail
    if (file)
      embed.thumbnail = {
        url: `attachment://${file.name}`,
      };

    game.fastEmbed(
      message,
      player,
      embed,
      `${item.getName()} ${item.quantity > 1 ? `(x${item.quantity})` : ``}`,
      file ? file : undefined
    );

    player.unlockCommands(message, server, ["sell", "eat"]);
  },
};

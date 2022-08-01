export default {
  name: "iteminfo",
  aliases: ["ii"],
  arguments: "<item name>",
  description: "Get detailed information about an item.",
  category: "Items",
  useInCombat: true,
  async execute(message, args, prisma, config, player, game, server) {
    if (!args[0]) return game.reply(message, "provide the name of an item.");

    const item = await player.getItem(args.join(" "));

    if (!item)
      return game.reply(
        message,
        `not a valid item. Check your items with \`${server.prefix}inventory\``
      );

    const itemName = item.name.split(" ").join("_").toLowerCase();

    let description = `
*${item.info}*\n
Category: \`${game.titleCase(item.category)}\``;

    if (item.category == "Weapon") {
      description += `\nWeapon Type: \`${game.titleCase(item.weaponType)}\``;
      description += `\nDamage: \`${item.damage.value}\`${
        config.emojis.damage[item.damage.type]
      }`;
    }

    if (item.health) {
      description += `\nCan be eaten to regain \`${item.health}\` ${config.emojis.health}`;
    }

    if (item.value)
      description += `\nResell value: \`${item.value}\` ${config.emojis.mark}`;

    const embed = {
      description,
    };

    game.fastEmbed(
      message,
      player,
      embed,
      `${item.getName()} ${item.quantity > 1 ? `(x${item.quantity})` : ``}`,
      item.image ? itemName : undefined
    );

    player.unlockCommands(message, server, ["sell", "eat"]);
  },
};

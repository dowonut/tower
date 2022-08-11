export default {
  name: "merchants",
  aliases: ["m", "merchant"],
  arguments: "<merchant type>",
  description: "See all merchants on this floor and the items they sell.",
  category: "Items",
  async execute(message, args, prisma, config, player, game, server) {
    const input = args.join(" ");

    let embed;
    let title;

    if (!input) {
      let description = ``;

      const merchants = await player.getUnlockedMerchants();

      if (!merchants)
        return game.reply(
          message,
          `you haven't met any merchants yet. Try exploring the village...`
        );

      // Grab all merchants
      for (const merchant of merchants) {
        if (!merchant) continue;

        const mCategory = game.titleCase(merchant.category);
        const mName = game.titleCase(merchant.name);
        description += `\n**${mName}** | \`${mCategory} Merchant\``;
        // description += `\n**${game.titleCase(merchant.category)} Merchant**`;
        // description += `\nName: \`${game.titleCase(merchant.name)}\``;
      }

      description += `\n\nSee what a merchant is selling with \`${server.prefix}merchant <name/category>\``;

      title = `Merchants on Floor ${player.floor}`;
      embed = {
        description: description,
      };
    } else {
      // Grab specific merchant
      const merchants = await player.getUnlockedMerchants();

      const merchant = merchants.find(
        (x) => x.name == input || x.category == input
      );
      if (!merchant) return game.reply(message, "not a valid merchant.");

      let description = ``;
      for (const [key, value] of Object.entries(merchant.items)) {
        const item = await game.getMerchantItem(key, player);

        let emoji = config.emojis.items[item.name]
          ? config.emojis.items[item.name]
          : config.emojis.blank;

        let itemStock = ``;
        let itemName = ``;
        if (item.stock > 0) {
          itemStock = `x${item.stock}`;
          itemName = `**${item.getName()}**`;
        } else {
          itemStock = `Out of Stock`;
          itemName = `${item.getName()}`;
        }

        description += `\n${emoji} ${itemName} | \`${itemStock}\` | \`${item.price}\`${config.emojis.mark} | *${item.description}*`;
      }

      const mCategory = game.titleCase(merchant.category);
      const mName = game.titleCase(merchant.name);

      title = `${mName} - ${mCategory} Merchant`;
      embed = {
        description: description,
        footer: { text: `You have ${player.marks} marks` },
      };
      player.unlockCommands(message, server, ["buy"]);
    }

    game.fastEmbed(message, player, embed, title);
  },
};

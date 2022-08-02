import merchants from "../../game/merchants.js";
import items from "../../game/items.js";

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

      // Grab all merchants
      for (const [key, value] of Object.entries(merchants[player.floor - 1])) {
        description += `\n\\> \`${value.category} Merchant\``;
      }

      title = `Merchants on Floor ${player.floor}`;
      embed = {
        description: description,
      };
    } else {
      // Grab specific merchant
      const merchant = merchants[player.floor - 1][input.toLowerCase()];
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

        description += `${emoji} ${itemName} | \`${itemStock}\` | \`${item.price}\`${config.emojis.mark} | *${item.description}*`;
      }

      title = `${merchant.category} Merchant`;
      embed = {
        description: description,
        footer: { text: `You have ${player.marks} marks` },
      };
      player.unlockCommands(message, server, ["buy"]);
    }

    game.fastEmbed(message, player, embed, title);
  },
};

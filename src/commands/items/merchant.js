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
        description += `\\> \`${value.category} Merchant\`
        `;
      }

      title = `Merchants on Floor ${player.floor}`;
      embed = {
        description:
          description +
          `\nSee what a merchant is selling with \`${server.prefix}merchant <merchant type>\``,
      };
    } else {
      // Grab specific merchant
      const merchant = merchants[player.floor - 1][input.toLowerCase()];
      if (!merchant) return game.reply(message, "not a valid merchant.");

      let description = ``;
      for (const [key, value] of Object.entries(merchant.items)) {
        const item = await game.getMerchantItem(key, player);

        if (item.stock > 0) {
          description += `**${item.name}** | \`x${item.stock}\` | \`${item.price}\`${config.emojis.mark} | *${item.description}*`;
        } else {
          description += `${item.name} | \`Out of Stock\` | \`${item.price}\`${config.emojis.mark} | *${item.description}*`;
        }
      }

      title = `${merchant.category} Merchant`;
      embed = {
        description: description,
        footer: { text: `You have ${player.marks} marks` },
      };
      player.unlockCommand(message, server, "buy");
    }

    game.fastEmbed(message, player, embed, title);
  },
};

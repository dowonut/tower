import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "merchants",
  aliases: ["m", "merchant"],
  arguments: [
    { name: "merchant", type: "playerAvailableMerchant", required: false },
  ],
  description: "See all merchants on this floor and the items they sell.",
  category: "item",
  async execute(message, args, player, server) {
    const input = args.merchant;

    let embed: Embed;
    let title: string;

    // Fetch unlocked merchants
    const merchants = await player.getUnlockedMerchants();

    // Check if player has unlocked any merchants
    if (!merchants[0])
      return game.error({
        message,
        content: `you haven't met any merchants yet. Try exploring the village...`,
      });

    if (!input) {
      let description = ``;

      // Grab all merchants
      for (const merchant of merchants) {
        if (!merchant) continue;

        const mCategory = game.titleCase(merchant.category);
        const mName = game.titleCase(merchant.name);
        description += `\n**${mName}** | \`${mCategory} Merchant\``;
      }

      description += `\n\nSee what a merchant is selling with \`${server.prefix}merchant <name/category>\``;

      title = `Merchants on Floor ${player.floor}`;
      embed = {
        description: description,
      };
    } else {
      // Grab specific merchant
      const merchant = merchants.find(
        (x) =>
          x.name == input.toLowerCase() || x.category == input.toLowerCase()
      );
      if (!merchant)
        return game.error({ message, content: "not a valid merchant." });

      let description = ``;
      const merchantItems = await game.getMerchantItems(player, merchant.name);

      for (const item of merchantItems) {
        let emoji = item.getEmoji();

        if (item.stock > 0) {
          const itemStock = `x${item.stock}`;
          const itemName = `**${item.getName()}**`;
          description += `\n${emoji} ${itemName} | \`${itemStock}\` | \`${item.price}\`${config.emojis.mark}`;
          //description += `\n*${item.description}*`;
        } else {
          let itemStock = `out of stock`;
          if (item.restock) {
            const restocked = item.restocked;
            const date = new Date().getDate();
            itemStock = `restocks in ${item.restock - (date - restocked)} days`;
          }
          const itemName = `${item.getName()}`;
          description += `\n${emoji} ${itemName} | \`${itemStock}\``;
        }
      }

      const mCategory = game.titleCase(merchant.category);
      const mName = game.titleCase(merchant.name);

      title = `${mName} - ${mCategory} Merchant`;
      embed = {
        description: description,
        footer: { text: `You have ${player.marks} marks` },
      };
      player.unlockCommands(message, ["buy"]);
    }

    game.fastEmbed({ message, player, embed, title });
  },
} as Command;

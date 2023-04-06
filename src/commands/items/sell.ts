import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "sell",
  aliases: ["se"],
  arguments: [
    { name: "item_name", type: "playerOwnedItem" },
    { name: "quantity", type: "number", required: false },
  ],
  description: "Sell items in your inventory.",
  category: "item",
  async execute(message, args, player, server) {
    let quantity: string | number = args.quantity;

    // Fetch item data
    const item = await player.getItem(args.item_name);

    // Return if no item
    if (!item) return game.error({ message, content: "not a valid item." });

    if (!item.value)
      return game.error({ message, content: "you can't sell this item." });

    if (item.equipped)
      return game.error({
        message,
        content: "you can't sell an item while it's equipped.",
      });

    if (quantity == "all") {
      quantity = item.quantity;
    }

    if (+quantity > item.quantity)
      return game.error({
        message,
        content: "you don't have enough items to do that.",
      });

    await player.giveItem(args.item_name, -quantity);

    const playerData = await player.update({
      marks: { increment: item.value * +quantity },
    });

    game.send({
      message,
      reply: true,
      content: `you sold \`${quantity}x\` **${item.getName()}** for \`${
        item.value * +quantity
      }\` ${config.emojis.mark} | Total: \`${playerData.marks}\` ${
        config.emojis.mark
      }`,
    });

    player.unlockCommands(message, ["merchants"]);

    return;
  },
} as Command;

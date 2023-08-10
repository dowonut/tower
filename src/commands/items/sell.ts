import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "sell",
  aliases: ["se"],
  arguments: [
    { name: "item", type: "playerOwnedItem" },
    { name: "quantity", type: "number", required: false },
  ],
  description: "Sell items in your inventory.",
  category: "item",
  async execute(message, args, player, server) {
    let quantity: string | number = args.quantity;

    // Fetch item data
    const { item } = args;

    if (!item.value) return game.error({ player, content: "you can't sell this item." });

    if (item.equipped)
      return game.error({
        player,
        content: "you can't sell an item while it's equipped.",
      });

    if (quantity == "all") {
      quantity = item.quantity;
    }

    if (+quantity > item.quantity)
      return game.error({
        player,
        content: "you don't have enough items to do that.",
      });

    await player.giveItem(item.name, -quantity);

    const playerData = await player.update({
      marks: { increment: item.value * +quantity },
    });

    game.send({
      player,
      reply: true,
      content: `Sold \`${quantity}x\` **${item.getName()}** for \`${item.value * +quantity}\` ${
        config.emojis.mark
      } (\`${playerData.marks}\` ${config.emojis.mark})`,
    });

    player.unlockCommands(["merchants"]);

    return;
  },
} as Command;

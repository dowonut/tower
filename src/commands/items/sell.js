export default {
  name: "sell",
  aliases: ["se"],
  arguments: "<item name> $ <quantity>|all",
  description: "Sell items in your inventory.",
  category: "Items",
  async execute(message, args, prisma, config, player, game, server) {
    const variables = args.join(" ").split("$");

    const itemNameInput = variables[0].trim();
    const quantityInput = variables[1];

    // Check for valid quantity
    let quantity = game.checkQuantity(quantityInput, game, message);
    if (!quantity) return;

    // Check if item name provided
    if (!itemNameInput)
      return game.reply(message, "provide the name of an item.");

    // Fetch item data
    const item = await player.getItem(itemNameInput);

    // Return if no item
    if (!item) return game.reply(message, "not a valid item.");

    if (item.canSell == false)
      return game.reply(message, "you can't sell this item.");

    if (quantity == "all") {
      quantity = item.quantity;
    }

    if (quantity > item.quantity)
      return game.reply(message, "you don't have enough items to do that.");

    await player.giveItem(itemNameInput, -quantity);

    const playerData = await player.update({
      marks: { increment: item.value * quantity },
    });

    game.reply(
      message,
      `you sold \`${quantity}x\` **${item.name}** for \`${
        item.value * quantity
      }\` ${config.emojis.mark} (Total: \`${playerData.marks}\` ${
        config.emojis.mark
      })`
    );

    player.unlockCommand(message, server, "merchants");
  },
};

export default {
  name: "buy",
  aliases: ["b"],
  arguments: "<item name> $ <quantity>|all",
  description: "Purchase items from merchants.",
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
    const item = game.getItem(itemNameInput);

    // Return if no item
    if (!item) return game.reply(message, "not a valid item.");

    // Get item from merchant
    const merchantItem = await game.getMerchantItem(itemNameInput, player);

    // Check if can purchase item
    if (!merchantItem)
      return game.reply(
        message,
        "this item can't be purchased from merchants."
      );

    // Set quantity to all
    if (quantity == "all") {
      quantity = merchantItem.stock;
    }

    // Check if item is in stock
    if (merchantItem.stock < 1) {
      return game.reply(message, "this item is out of stock.");
    }

    // Check if the player can afford
    if (merchantItem.price * quantity > player.marks) {
      return game.reply(
        message,
        `you don't have enough ${config.emojis.mark} to buy this.`
      );
    }

    // Check if buying more than stock
    if (quantity > merchantItem.stock) {
      return game.reply(
        message,
        "the merchant doesn't have enough of this item in stock."
      );
    }

    // Subtract marks from player
    await player.update({
      marks: { increment: -merchantItem.price * quantity },
    });
    // Give item to player
    await player.giveItem(merchantItem.name, quantity);

    // Check if already tracking stock
    if (merchantItem.trackingStock) {
      // Decrease stock for item
      await prisma.merchantStock.updateMany({
        where: {
          playerId: player.id,
          itemName: merchantItem.name.toLowerCase(),
          floor: player.floor,
        },
        data: { stock: { increment: -quantity } },
      });
    } else {
      // Create new stock track for item
      await prisma.merchantStock.create({
        data: {
          playerId: player.id,
          itemName: merchantItem.name.toLowerCase(),
          floor: player.floor,
          stock: merchantItem.stock - quantity,
        },
      });
    }

    // Send buy message
    game.reply(
      message,
      `you bought \`${quantity}x\` **${item.getName()}** for \`${
        merchantItem.price * quantity
      }\` ${config.emojis.mark}`
    );

    // Unlock equipment
    if (["weapon"].includes(item.category)) {
      player.unlockCommands(message, server, ["equipment"]);
    }
  },
};

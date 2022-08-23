export default {
  name: "buy",
  aliases: ["b"],
  arguments: "<item name> $ <quantity>|all",
  description: "Purchase items from merchants.",
  category: "Items",
  async execute(message, args, prisma, config, player, game, server) {
    const variables = args.join(" ").split("$");

    const itemNameInput = variables[0].trim().toLowerCase();
    const quantityInput = variables[1];

    // Check for valid quantity
    let quantity = game.checkQuantity(quantityInput, game, message);
    if (!quantity) return;

    // Check if item name provided
    if (!itemNameInput)
      return game.error(message, "provide the name of an item.");

    // Fetch item data
    const item = game.getItem(itemNameInput);

    // Return if no item
    if (!item) return game.error(message, "not a valid item.");

    // Get item from merchant
    const merchantItem = await game.getMerchantItem(itemNameInput, player);
    //console.log(merchantItem);

    // Check if can purchase item
    if (!merchantItem)
      return game.error(message, "you can't purchase this item.");

    // Set quantity to all
    if (quantity == "all") {
      quantity = Math.floor(player.marks / merchantItem.price);
      if (quantity > merchantItem.stock) quantity = merchantItem.stock;
    }

    // Check if item is in stock
    if (merchantItem.stock < 1) {
      return game.error(message, "this item is out of stock.");
    }

    // Check if the player can afford
    if (merchantItem.price * quantity > player.marks) {
      return game.error(
        message,
        `you don't have enough ${config.emojis.mark} to buy this.`
      );
    }

    // Check if buying more than stock
    if (quantity > merchantItem.stock) {
      return game.error(
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

    // Get day of the month
    const date = new Date().getDate();

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
          restocked: date,
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
    if (["weapon", "armor"].includes(item.category)) {
      player.unlockCommands(message, server, ["equipment"]);
    }

    // Unlock recipe
    if (item.category == "recipe") {
      game.reply(
        message,
        `you unlocked a new recipe: **${game.titleCase(
          item.item
        )}**\nSee all your recipes with \`${server.prefix}recipes\``
      );

      player.unlockCommands(message, server, ["recipes"]);
    }
  },
};

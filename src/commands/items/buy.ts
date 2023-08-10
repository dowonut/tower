import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "buy",
  aliases: ["b"],
  arguments: [
    { name: "item_name", type: "item" },
    { name: "quantity", required: false, type: "number" },
  ],
  description: "Purchase items from merchants.",
  category: "item",
  async execute(message, args, player, server) {
    const itemNameInput = args.item_name;
    let quantity = args.quantity;

    // Fetch item data
    const item = game.getItem(itemNameInput);

    // Get item from merchant
    const merchantItem = await game.getMerchantItem(itemNameInput, player);
    //console.log(merchantItem);

    // Check if can purchase item
    if (!merchantItem) return game.error({ player, content: "you can't purchase this item." });

    // Set quantity to all
    if (quantity == "all") {
      quantity = Math.floor(player.marks / merchantItem.price);
      if (quantity > merchantItem.stock) quantity = merchantItem.stock;
    }

    // Check if item is in stock
    if (merchantItem.stock < 1) {
      return game.error({ player, content: "this item is out of stock." });
    }

    // Check if the player can afford
    if (merchantItem.price * quantity > player.marks) {
      return game.error({
        player,
        content: `you don't have enough ${config.emojis.mark} to buy this.`,
      });
    }

    // Check if buying more than stock
    if (quantity > merchantItem.stock) {
      return game.error({
        player,
        content: "the merchant doesn't have enough of this item in stock.",
      });
    }

    // Subtract marks from player
    player = await player.update({
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
    game.send({
      player,
      reply: true,
      content: `you bought \`${quantity}x\` **${item.getName()}** for \`${merchantItem.price * quantity}\` ${
        config.emojis.mark
      }`,
    });

    // Unlock equipment
    if (["weapon", "armor"].includes(item.category)) {
      player.unlockCommands(["equipment"]);
    }

    // Unlock recipe
    if (item.category == "recipe") {
      game.send({
        player,
        reply: true,
        content: `you unlocked a new recipe: **${game.titleCase(item.recipeItem)}**\nSee all your recipes with \`${
          server.prefix
        }recipes\``,
      });

      player.unlockCommands(["recipes"]);
    }
  },
} as Command;

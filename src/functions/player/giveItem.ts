import { prisma, game } from "../../tower.js";

export default (async function (name: string, quantity: number = 1) {
  const item = game.getItem(name);

  // Check if player already has item
  const playerItem = await prisma.inventory.findMany({
    where: {
      playerId: this.id,
      name: { equals: name, mode: "insensitive" },
    },
  });

  // Emit event for item received
  game.events.emit("itemReceive", { item: item, player: this });

  // If item already exists, increment
  if (playerItem[0]) {
    // Update existing item
    await prisma.inventory.updateMany({
      where: {
        playerId: this.id,
        name: { equals: name, mode: "insensitive" },
      },
      data: {
        quantity: { increment: quantity },
      },
    });
    // Delete item from database if quantity is 0
    if (playerItem[0].quantity + quantity <= 0) {
      await prisma.inventory.deleteMany({
        where: {
          playerId: this.id,
          name: { equals: name, mode: "insensitive" },
        },
      });
    }
  }
  // Create new item entry
  else {
    // Check if item is recipe
    if (item.category == "recipe") {
      await this.addRecipe(item.recipeItem);
    } else {
      // Create new item
      await prisma.inventory.create({
        data: {
          playerId: this.id,
          name: item.name,
          quantity: quantity,
        },
      });
    }
  }

  const newItem = await this.getItem(item.name);

  return newItem;
} satisfies PlayerFunction);

import items from "../../game/classes/items.js";

export default {
  giveItem: async (user, prisma, itemName, quantity) => {
    const item = items.find((x) => x.name == itemName.toLowerCase());
    const itemQuantity = quantity ? quantity : 1;

    const playerItem = await prisma.inventory.findMany({
      where: {
        playerId: user.id,
        name: { equals: itemName, mode: "insensitive" },
      },
    });

    let newItem;
    if (playerItem[0]) {
      newItem = await prisma.inventory.updateMany({
        where: {
          playerId: user.id,
          name: { equals: itemName, mode: "insensitive" },
        },
        data: {
          quantity: { increment: quantity },
        },
      });
    } else {
      newItem = await prisma.inventory.create({
        data: {
          playerId: user.id,
          name: item.name,
          quantity: itemQuantity,
        },
      });
    }

    return { ...playerItem[0], ...newItem };
  },
};

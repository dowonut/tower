import { game, prisma } from "../../../tower.js";

export default async function giveItem(
  player: Player,
  name: string,
  quantity: number = 1
) {
  const item = game.getItem(name);
  if (!item) return;

  const playerItem = await player.getItem(item.name);

  if (playerItem) {
    await prisma.inventory.updateMany({
      where: {
        playerId: player.id,
        name: { equals: name, mode: "insensitive" },
      },
      data: {
        quantity: { increment: quantity },
      },
    });
  } else {
    await prisma.inventory.create({
      data: {
        playerId: player.id,
        name: item.name,
        quantity: quantity,
      },
    });
  }

  game.events.emit("itemReceive", {
    player,
    item,
  });

  return await player.getItem(item.name);
}

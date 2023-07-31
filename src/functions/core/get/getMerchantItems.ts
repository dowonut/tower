import { game, prisma } from "../../../tower.js";

export default async function getMerchantItems(
  player: Player,
  merchantName?: string
) {
  // Get player merchants
  const filteredMerchants = await player.getUnlockedMerchants();
  if (!filteredMerchants) return;

  // Find merchant by item
  let items: MerchantItemMerged[] = [];

  let merchantItems: MerchantItem[] = [];
  if (merchantName) {
    merchantItems = filteredMerchants.find((x) => x.name == merchantName).items;
  } else {
    merchantItems = filteredMerchants.map((x) => x.items).flat();
  }

  for (const merchantItem of merchantItems) {
    let item = { ...merchantItem };

    // Get day of the month
    const date = new Date().getDate();

    // Get player merchant stock
    const merchantStock = await prisma.merchantStock.findMany({
      where: {
        playerId: player.id,
        itemName: item.name,
        floor: player.floor,
      },
    });
    // Define merchant stock
    if (merchantStock.length > 0) {
      item.trackingStock = true;

      // If merchant item needs to be restocked
      if (item.restock && date - merchantStock[0].restocked >= item.restock) {
        // Update restocked date
        await prisma.merchantStock.updateMany({
          where: {
            playerId: player.id,
            itemName: item.name,
            floor: player.floor,
          },
          data: {
            restocked: date,
            stock: item.stock,
          },
        });
      }
      // If merchant item doesn't need to be restocked
      else {
        item.stock = merchantStock[0].stock;
        item.restocked = merchantStock[0].restocked;
      }
    }

    // Define final object
    const itemClass = game.getItem(item.name);
    const finalItem = Object.assign(
      itemClass,
      item
    ) satisfies MerchantItemMerged;

    items.push(finalItem);
  }

  const sortedItems = items.sort((a, b) => b.stock - a.stock);

  return sortedItems;
}

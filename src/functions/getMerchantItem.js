import merchants from "../game/classes/merchants.js";
import itemInfo from "../game/classes/items.js";

export default {
  getMerchantItem: async (itemName, player) => {
    let items = [];

    for (const [key, merchant] of Object.entries(merchants[0])) {
      for (const [key, item] of Object.entries(merchant.items)) {
        const merchantStock = await player.prisma.merchantStock.findMany({
          where: { playerId: player.id, itemName: key, floor: player.floor },
        });
        if (merchantStock[0]) {
          item.stock = merchantStock[0].stock;
          item.trackingStock = true;
        }

        let itemData = { ...itemInfo.find((x) => x.name == key), ...item };

        items.push(itemData);
      }
    }

    let finalItem = items.find((x) => x.name.toLowerCase() === itemName);

    return finalItem;
  },
};

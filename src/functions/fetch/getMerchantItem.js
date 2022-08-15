import merchants from "../../game/classes/merchants.js";
import itemInfo from "../../game/classes/items.js";

export default {
  getMerchantItem: async (itemName, player) => {
    let items = [];

    const filteredMerchants = await player.getUnlockedMerchants();

    if (!filteredMerchants) return undefined;

    for (const merchant of filteredMerchants) {
      for (let item of merchant.items) {
        const merchantStock = await player.prisma.merchantStock.findMany({
          where: {
            playerId: player.id,
            itemName: item.name,
            floor: player.floor,
          },
        });
        if (merchantStock[0]) {
          item.stock = merchantStock[0].stock;
          item.trackingStock = true;
        }

        let itemData = {
          ...itemInfo.find((x) => x.name == item.name),
          ...item,
        };

        items.push(itemData);
      }
    }

    let finalItem = items.find((x) => x.name.toLowerCase() === itemName);

    return finalItem;
  },
};

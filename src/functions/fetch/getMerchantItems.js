import merchants from "../../game/classes/merchants.js";
import itemInfo from "../../game/classes/items.js";

export default {
  getMerchantItems: async (merchantName, player) => {
    // Get player merchants
    const filteredMerchants = await player.getUnlockedMerchants();
    if (!filteredMerchants) return undefined;

    // Find merchant by item
    let items = [];
    const merchant = filteredMerchants.find((x) => x.name == merchantName);

    for (const merchantItem of merchant.items) {
      let item = { ...merchantItem };

      // Get day of the month
      const date = new Date().getDate();

      // Get player merchant stock
      const merchantStock = await player.prisma.merchantStock.findMany({
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
          await player.prisma.merchantStock.updateMany({
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
      const finalItem = {
        ...itemInfo.find((x) => x.name == item.name),
        ...item,
      };

      items.push(finalItem);
    }

    const sortedItems = items.sort((a, b) => b.stock - a.stock);

    return sortedItems;
  },
};

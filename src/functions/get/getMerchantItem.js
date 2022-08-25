import merchants from "../../game/classes/merchants.js";
import itemInfo from "../../game/classes/items.js";

export default {
  getMerchantItem: async (itemName, player) => {
    // Get player merchants
    const filteredMerchants = await player.getUnlockedMerchants();
    if (!filteredMerchants) return undefined;

    // Find merchant by item
    const merchant = filteredMerchants.find((x) =>
      x.items.find((x) => x.name == itemName)
    );
    // Find item by name
    const merchantItem = merchant.items.find((x) => x.name == itemName);

    // Define item
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
    const finalItem = {
      ...itemInfo.find((x) => x.name == item.name),
      ...item,
    };

    return finalItem;
  },
};

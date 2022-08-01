import items from "../game/items.js";

export default {
  getItem: (itemName) => {
    if (!itemName) return undefined;

    return items.find((x) => x.name == itemName.toLowerCase());
  },
};

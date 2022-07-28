import items from "../game/items.js";

export default {
  getItem: (itemName) => {
    return items[itemName.toLowerCase()];
  },
};

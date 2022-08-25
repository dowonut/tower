import { loadFiles } from "./_loadFiles.js";

class Recipe {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

    // Check if player can craft item
    this.canCraft = async (player) => {
      for (const item of this.items) {
        const playerItem = await player.getItem(item.name);
        if (!playerItem) return false;

        if (item.quantity && item.quantity > playerItem.quantity) return false;
      }
      return true;
    };

    // Get item text for recipe
    this.itemText = async (player, available) => {
      let items = [];
      // If can craft recipe, get all items
      if (available) {
        for (const item of this.items) {
          items.push(itemText(item));
        }
      }
      // If can't craft recipe, get missing items
      else {
        for (const item of this.items) {
          const playerItem = await player.getItem(item.name);
          // Check if player has item or enough of item
          if (
            !playerItem ||
            (item.quantity && item.quantity > playerItem.quantity)
          ) {
            items.push(itemText(item));
          }
        }
      }
      return items.join(", ");

      // Function for item text
      function itemText(item) {
        let itemText = `\`${game.titleCase(item.name)}\``;
        if (item.quantity)
          itemText = `\`${item.quantity}x ${game.titleCase(item.name)}\``;
        return itemText;
      }
    };
  }
}

const recipes = await loadFiles("recipes", Recipe);

export default recipes;

// export default [
//   new Recipe({
//     name: "iron sword",
//     items: [{ name: "refined iron", quantity: 2 }, { name: "sword handle" }],
//     time: 5,
//     damage: { min: 2, max: 4 },
//   }),
//   new Recipe({
//     name: "sword handle",
//     items: [{ name: "stick" }, { name: "leather" }],
//     time: 5,
//   }),
// ];

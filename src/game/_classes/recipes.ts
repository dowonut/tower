import { createClassFromType } from "../../functions/core/index.js";
import { loadFiles } from "../../functions/core/game/loadFiles.js";
import { game, config } from "../../tower.js";

const RecipeBaseClass = createClassFromType<RecipeData>();

export class RecipeClass extends RecipeBaseClass {
  constructor(object: Generic<RecipeData>) {
    super(object);
  }

  // Check if player can craft item
  async canCraft(player: Player) {
    for (const item of this.items) {
      const playerItem = await player.getItem(item.name);
      if (!playerItem) return false;

      if (item.quantity && item.quantity > playerItem.quantity) return false;
    }
    return true;
  }

  // Get item text for recipe
  async itemText(player: Player, available: boolean) {
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
        if (!playerItem || (item.quantity && item.quantity > playerItem.quantity)) {
          items.push(itemText(item));
        }
      }
    }
    return items.join(", ");

    // Function for item text
    function itemText(item: { name: string; quantity?: number }) {
      let itemText = `\`${game.titleCase(item.name)}\``;
      if (item.quantity) itemText = `\`${item.quantity}x ${game.titleCase(item.name)}\``;
      return itemText;
    }
  }
}

const recipes = await loadFiles<RecipeClass>("recipes", RecipeClass);

export default recipes;

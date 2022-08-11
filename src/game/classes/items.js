import game from "../../functions/titleCase.js";
import { loadFiles } from "./_loadFiles.js";
import fs from "fs";

class Item {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

    if (this.category == "Food")
      this.description += ` Heals ${this.health} HP.`;

    this.getName = () => {
      return game.titleCase(this.name);
    };

    this.getImage = () => {
      // Format item name
      const itemName = this.name.split(" ").join("_").toLowerCase();

      // Create path and check if item image exists
      const path = `./assets/items/${itemName}.png`;
      let file = undefined;

      // Attach image
      if (fs.existsSync(path)) {
        // Get image file
        file = {
          attachment: path,
          name: `${itemName}.png`,
        };
      }

      return file;
    };
  }
}

const items = await loadFiles("items", Item);

export default items;

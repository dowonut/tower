import game from "../../functions/format/titleCase.js";
import { loadFiles } from "./_loadFiles.js";
import fs from "fs";
import * as config from "../../config.js";

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
      const itemName = this.getImageName();

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

    this.getEmoji = () => {
      const emojiName = this.getImageName();

      let emoji = config.emojis.items[emojiName];
      if (!emoji) emoji = config.emojis.blank;

      return emoji;
    };

    this.getImageName = () => {
      let imageName = this.name.split(" ").join("_").toLowerCase();

      if (this.category == "map") imageName = "map";
      else if (this.category == "potion") imageName = "potion";

      return imageName;
    };
  }
}

const items = await loadFiles("items", Item);

export default items;

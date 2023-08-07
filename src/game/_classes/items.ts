import fs from "fs";
import { createClassFromType, loadFiles } from "../../functions/core/index.js";
import { config } from "../../tower.js";

const ItemBaseClass = createClassFromType<ItemBase>();

export class ItemClass extends ItemBaseClass {
  constructor(item: Generic<ItemBase>) {
    super(item);
  }

  /** Get image object. */
  getImage(): { attachment: string; name: string } {
    // Format item name
    const itemName = this.getImageName();

    // Create path and check if item image exists
    let path = `./assets/items/${itemName}.png`;
    let file: any;

    // Change path for weapons
    if (this.category == "weapon") {
      path = `./assets/icons/${this.weaponType}.png`;
    }

    // Attach image
    if (fs.existsSync(path)) {
      // Get image file
      file = {
        attachment: path,
        name: `${itemName}.png`,
      };
    }

    return file;
  }

  /** Get emoji. */
  getEmoji(): string {
    const emojiName = this.getImageName();

    let emoji = config.emojis.items[emojiName];

    // Get weapon icon
    if (this.category == "weapon") {
      emoji = config.emojis.weapons[this.weaponType];
    }

    if (!emoji) emoji = config.emojis.blank;

    return emoji;
  }

  /** Get image name for generic type items. */
  getImageName() {
    let imageName = this.name.split(" ").join("_").toLowerCase();

    if (this.category == "map") imageName = "map";
    else if (this.category == "potion") imageName = "potion";
    else if (this.category == "recipe") imageName = "recipe";

    return imageName;
  }

  // STATS =================================================================
}

const items = await loadFiles<ItemClass>("items", ItemClass);

export default items;

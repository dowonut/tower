import fs from "fs";
import { game, config } from "../../tower.js";
// import * as game from "../../functions/core/index.js";
const ItemBaseClass = game.createClassFromType();
export class ItemClass extends ItemBaseClass {
    constructor(item) {
        super(item);
    }
    /** Get image object. */
    getImage() {
        // Format item name
        const itemName = this.getImageName();
        // Create path and check if item image exists
        const path = `./assets/items/${itemName}.png`;
        let file;
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
    getEmoji() {
        const emojiName = this.getImageName();
        let emoji = config.emojis.items[emojiName];
        if (!emoji)
            emoji = config.emojis.blank;
        return emoji;
    }
    /** Get image name for generic type items. */
    getImageName() {
        let imageName = this.name.split(" ").join("_").toLowerCase();
        if (this.category == "map")
            imageName = "map";
        else if (this.category == "potion")
            imageName = "potion";
        else if (this.category == "recipe")
            imageName = "recipe";
        return imageName;
    }
}
const items = await game.loadFiles("items", ItemClass);
export default items;

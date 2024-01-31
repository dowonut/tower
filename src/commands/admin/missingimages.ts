import enemies from "../../game/_classes/enemies.js";
import items from "../../game/_classes/items.js";
import { game } from "../../tower.js";

export default {
  name: "missingimages",
  aliases: ["mi"],
  description: "Check for missing images.",
  category: "admin",
  async execute(message, args, player, server) {
    let contentItems = `**Items with missing images:**\n`;
    let contentEnemies = `**Enemies with missing images:**\n`;

    for (const item of items) {
      const image = item.getImage();
      if (!image) contentItems += `\`${item.getName()}\` ❌\n`;
    }
    for (const enemy of enemies) {
      const image = enemy.getImagePath();
      if (!image || image == `./assets/enemies/placeholder.png`)
        contentEnemies += `\`${enemy.displayName}\` ❌\n`;
    }
    game.send({ player, content: contentItems + contentEnemies });
  },
} satisfies Command;

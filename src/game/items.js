import game from "../functions/titleCase.js";
import fs from "fs";
import { emojis } from "../config.js";

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

export default [
  // apple
  new Item({
    name: "apple",
    category: "food",
    description: "A tasty apple.",
    info: "A tasty apple you found lying on the ground somewhere...",
    health: 5,
  }),
  // slimeball
  new Item({
    name: "slimeball",
    category: "crafting",
    description: "A ball of slime, very round and slimy.",
    info: "A concentrated ball of slime collected by killing Slimes.",
    value: 1,
  }),
  // goblin skin
  new Item({
    name: "goblin skin",
    category: "crafting",
    description: "Has a rough texture and an unpleasant smell.",
    info: "A rough hide of skin collected by killing Goblins.",
    value: 5,
  }),
  // rusty sword
  new Item({
    name: "rusty sword",
    category: "weapon",
    weaponType: "sword",
    description: "Not the sharpest tool in the shed.",
    info: "An old rusty sword. Use it wisely before it falls aprt.",
    value: 8,
    equipSlot: "hand",
    damage: {
      value: 1,
      type: "slashing",
    },
  }),
  // rock
  new Item({
    name: "rock",
    category: "crafting",
    weaponType: "rock",
    description: "Literally just a rock.",
    info: "Why did you pick up a rock?",
    equipSlot: "hand",
    damage: {
      value: 1,
      type: "bludgeoning",
    },
  }),
  // stick
  new Item({
    name: "stick",
    category: "crafting",
    description: "A stick from a tree.",
    info: "Very grippable and satisfying to hold. You get an urge to hit something with it.",
  }),
  // fabric
  new Item({
    name: "fabric",
    category: "crafting",
    description: "A piece of fabric.",
    info: "You could use it to wipe your nose.",
    value: 1,
  }),
  // leather
  new Item({
    name: "leather",
    category: "crafting",
    description: "A firm piece leather.",
    info: "Leather from a cow. Useful for making things out of leather.",
    value: 1,
  }),
  // grey shard
  new Item({
    name: "grey shard",
    category: "enhancement",
    info: "A powerful shard dropped by a monster. Used to enhance items.",
  }),
];

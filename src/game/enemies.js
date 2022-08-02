import randomFunction from "../functions/random.js";
import game from "../functions/titleCase.js";
import { emojis } from "../config.js";
import fs from "fs";
const random = randomFunction.random;

class Enemy {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

    this.getImage = () => {
      // Format item name
      const enemyName = this.name.split(" ").join("_").toLowerCase();

      // Create path and check if item image exists
      const path = `./assets/enemies/${enemyName}.png`;
      let file = undefined;

      // Attach image
      if (fs.existsSync(path)) {
        // Get image file
        file = {
          attachment: path,
          name: `${enemyName}.png`,
        };
      }

      return file;
    };

    this.getName = () => {
      return game.titleCase(this.name);
    };

    this.getDamage = () => {
      // Base damage
      const baseDamage = random(this.damage.min, this.damage.max);

      // Damage multiplier
      const damageMultiplier = this.strength / 100 + 1;

      // Final damage
      const damage = Math.floor(baseDamage * damageMultiplier);

      return { value: damage, type: this.damage.type };
    };
  }
}

export default [
  // small slime
  new Enemy({
    name: "small slime",
    description: "A cute little guy. Would be a shame if you killed him.",
    maxHealth: 3,
    strength: 1,
    defence: 1,
    damage: {
      min: 1,
      max: 1,
      type: "bludgeoning",
    },
    image: "https://imgur.com/HV0tsn9.png",
    loot: [
      {
        name: "slimeball",
        dropChance: 100,
        min: 1,
        max: 2,
      },
    ],
    xp: {
      min: 30,
      max: 40,
    },
  }),
  // big slime
  new Enemy({
    name: "big slime",
    description: "How did a slime get this large? Try not to get swallowed.",
    maxHealth: 5,
    strength: 1,
    defence: 1,
    damage: {
      min: 1,
      max: 2,
      type: "bludgeoning",
    },
    image: "https://imgur.com/HV0tsn9.png",
    loot: [
      {
        name: "slimeball",
        dropChance: 100,
        min: 2,
        max: 4,
      },
    ],
    xp: {
      min: 40,
      max: 50,
    },
  }),
  // burning slime
  new Enemy({
    name: "burning slime",
    description: "The slime is constantly on fire... how?",
    maxHealth: 4,
    strength: 1,
    defence: 1,
    damage: {
      min: 2,
      max: 3,
      type: "fire",
    },
    image: "https://imgur.com/HV0tsn9.png",
    loot: [
      {
        name: "slimeball",
        dropChance: 50,
        min: 1,
        max: 2,
      },
    ],
    shard: {
      dropChance: 20,
      type: "grey",
    },
    xp: {
      min: 40,
      max: 50,
    },
  }),
  // wet slime
  new Enemy({
    name: "wet slime",
    description: "Somehow wet instead of sticky. Did it just have a bath?",
    maxHealth: 4,
    strength: 1,
    defence: 1,
    damage: {
      min: 1,
      max: 2,
      type: "water",
    },
    image: "https://imgur.com/HV0tsn9.png",
    loot: [
      {
        name: "slimeball",
        dropChance: 100,
        min: 1,
        max: 2,
      },
    ],
    xp: {
      min: 30,
      max: 40,
    },
  }),
  // baby goblin
  new Enemy({
    name: "baby goblin",
    description:
      "Do not be fooled by its cute appearance. It will gladly eat you alive.",
    maxHealth: 6,
    strength: 3,
    defence: 1,
    damage: {
      min: 2,
      max: 3,
      type: "bludgeoning",
    },
    image: "https://imgur.com/Fte78Qa.png",
    loot: [
      {
        name: "goblin skin",
        dropChance: 100,
        min: 1,
        max: 1,
      },
    ],
    xp: {
      min: 50,
      max: 60,
    },
  }),
  // hungry goblin
  new Enemy({
    name: "hungry goblin",
    description: "Careful... they're dangerous when they're hungry.",
    maxHealth: 8,
    strength: 3,
    defence: 1,
    damage: {
      min: 3,
      max: 4,
      type: "bludgeoning",
    },
    image: "https://imgur.com/Fte78Qa.png",
    loot: [
      {
        name: "goblin skin",
        dropChance: 100,
        min: 1,
        max: 2,
      },
    ],
    xp: {
      min: 60,
      max: 70,
    },
  }),
  // hobgoblin
  new Enemy({
    name: "hobgoblin",
    description: "Do not enrage the hobgoblin. Bad idea.",
    maxHealth: 10,
    strength: 3,
    defence: 1,
    damage: {
      min: 4,
      max: 5,
      type: "bludgeoning",
    },
    image: "https://imgur.com/Fte78Qa.png",
    loot: [
      {
        name: "goblin skin",
        dropChance: 100,
        min: 1,
        max: 2,
      },
    ],
    shard: {
      dropChance: 20,
      type: "grey",
    },
    xp: {
      min: 70,
      max: 80,
    },
  }),
];

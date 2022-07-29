import randomFunction from "../functions/random.js";
import { emojis } from "../config.js";
const random = randomFunction.random;

class Enemy {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

    this.getDamage = () => {
      // Base damage
      const baseDamage = random(this.damage[0], this.damage[1]);

      // Damage multiplier
      const damageMultiplier = this.strength / 100 + 1;

      // Final damage
      const damage = Math.floor(baseDamage * damageMultiplier);

      return damage;
    };
  }
}

export default {
  slime: new Enemy({
    name: "Slime",
    maxHealth: 5,
    strength: 1,
    defence: 1,
    damage: [1, 3],
    image: "https://imgur.com/HV0tsn9.png",
    loot: {
      Slimeball: {
        name: "Slimeball",
        dropChance: 100,
        dropMin: 1,
        dropMax: 3,
      },
    },
    xpMin: 30,
    xpMax: 40,
  }),
  goblin: new Enemy({
    name: "Goblin",
    maxHealth: 15,
    strength: 3,
    defence: 1,
    damage: [3, 6],
    image: "https://imgur.com/Fte78Qa.png",
    loot: {
      "Goblin Skin": {
        name: "Goblin Skin",
        dropChance: 100,
        dropMin: 1,
        dropMax: 1,
      },
    },
    xpMin: 40,
    xpMax: 60,
  }),
};

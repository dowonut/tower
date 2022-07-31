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
      const baseDamage = random(this.damage.min, this.damage.max);

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
    damage: {
      min: 1,
      max: 3,
    },
    image: "https://imgur.com/HV0tsn9.png",
    loot: {
      Slimeball: {
        name: "Slimeball",
        dropChance: 100,
        dropMin: 2,
        dropMax: 4,
      },
    },
    xp: {
      min: 30,
      max: 40,
    },
  }),
  goblin: new Enemy({
    name: "Goblin",
    maxHealth: 10,
    strength: 3,
    defence: 1,
    damage: {
      min: 3,
      max: 6,
    },
    image: "https://imgur.com/Fte78Qa.png",
    loot: {
      "Goblin Skin": {
        name: "Goblin Skin",
        dropChance: 100,
        dropMin: 1,
        dropMax: 1,
      },
    },
    xp: {
      min: 40,
      max: 60,
    },
  }),
};

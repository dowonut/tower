import randomFunction from "../functions/random.js";
import game from "../functions/titleCase.js";
import { emojis } from "../config.js";
const random = randomFunction.random;

class Enemy {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

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

      return damage;
    };
  }
}

export default [
  new Enemy({
    name: "slime",
    maxHealth: 5,
    strength: 1,
    defence: 1,
    damage: {
      min: 1,
      max: 3,
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
      min: 30,
      max: 40,
    },
  }),
  new Enemy({
    name: "Goblin",
    maxHealth: 10,
    strength: 3,
    defence: 1,
    damage: {
      min: 3,
      max: 6,
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
      min: 40,
      max: 60,
    },
  }),
];

import randomF from "../functions/random.js";
const random = randomF.random;

class Enemy {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

    this.damage = () => {
      return this.strength + random(1, 3);
    };
  }
}

export default {
  slime: new Enemy({
    name: "Slime",
    maxHealth: 5,
    strength: 1,
    defence: 1,
    image: "https://imgur.com/HV0tsn9.png",
    loot: {
      Slimeball: {
        name: "Slimeball",
        dropChance: 100,
        dropMin: 1,
        dropMax: 3,
      },
    },
    xpMin: 10,
    xpMax: 20,
  }),
  goblin: new Enemy({
    name: "Goblin",
    maxHealth: 15,
    strength: 3,
    defence: 1,
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

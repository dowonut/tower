export default {
  Slime: {
    name: "Slime",
    maxHealth: 5,
    strength: 1,
    defence: 1,
    attribute: "",
    weak: "",
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
  },
  Goblin: {
    name: "Goblin",
    maxHealth: 15,
    strength: 3,
    defence: 1,
    attribute: "",
    weak: "",
    image: "https://imgur.com/Fte78Qa.png",
    loot: {
      "Goblin Skin": {
        name: "Goblin Skin",
        dropChance: 100,
        dropMin: 1,
        dropMax: 1,
      },
    },
    xpMin: 15,
    xpMax: 25,
  },
  "The Demon Lord": {
    name: "The Demon Lord",
    maxHealth: 10000,
    strength: 100,
    defence: 100,
    attribute: "",
    weak: "",
    image:
      "https://cdn4.iconfinder.com/data/icons/cute-funny-monster-characters/66/28-512.png",
    loot: {
      "Key Shard 1": {
        name: "Floor Key 1",
        dropChance: 100,
        dropMin: 1,
        dropMax: 1,
      },
    },
    xpMin: 1000,
    xpMax: 2000,
  },
};

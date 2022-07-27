class Boss {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
  }
}

export default {
  "sticky manakor": new Boss({
    name: "Sticky Manakor",
    maxHealth: 100,
    strength: 10,
    defence: 10,
    image: "",
    //   loot: {
    //     Slimeball: {
    //       name: "Slimeball",
    //       dropChance: 100,
    //       dropMin: 1,
    //       dropMax: 3,
    //     },
    //   },
    xpMin: 10,
    xpMax: 20,
  }),
  "slippery jim": new Boss({
    name: "Slippery Jim",
    maxHealth: 90,
    strength: 10,
    defence: 15,
    image: "",
    //   loot: {
    //     "Goblin Skin": {
    //       name: "Goblin Skin",
    //       dropChance: 100,
    //       dropMin: 1,
    //       dropMax: 1,
    //     },
    //   },
    xpMin: 15,
    xpMax: 25,
  }),
};

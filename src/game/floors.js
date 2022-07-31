class Floor {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
  }
}

export default [
  new Floor({
    floor: 1,
    regions: [
      {
        name: "slime fields",
        description:
          "Lush rolling fields... with strange slimy creatures everywhere.",
        enemies: [{ name: "slime", weight: 100 }],
        loot: [{ name: "slimeball", weight: 100 }],
      },
      {
        name: "goblin caves",
        description:
          "Dark and gloomy caves filled with pesky goblins. You have been warned.",
        enemies: [{ name: "goblin", weight: 100 }],
        loot: [{ name: "rock", weight: 100 }],
      },
      {
        name: "lush forest",
        description: "A pleasant forest wish a shallow pond.",
        activities: [{ name: "fishing" }, { name: "woodcutting" }],
        loot: [
          { name: "stick", weight: 60 },
          { name: "apple", weight: 40 },
        ],
      },
      {
        name: "village",
        description:
          "A cozy village with kind people. Might they know something of the floor dungeons?",
        merchants: [
          { name: "weapon" },
          { name: "food" },
          { name: "cartographer" },
        ],
        loot: [
          { name: "cloth", weight: 20 },
          { name: "leather", weight: 20 },
          { name: "stick", weight: 60 },
        ],
      },
    ],
    // enemies: [
    //   {
    //     name: "Slime",
    //     weight: 80,
    //   },
    //   {
    //     name: "Goblin",
    //     weight: 20,
    //   },
    // ],
    //activities: [{ name: "Fishing" }, { name: "Woodcutting" }],
  }),
];

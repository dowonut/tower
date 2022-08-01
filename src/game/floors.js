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
        loot: [{ name: "slimeball", weight: 100, min: 1, max: 3 }],
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
        description:
          "A pleasant forest with a shallow pond. Perfect place to get some wood or do some fishing.",
        activities: [{ name: "fishing" }, { name: "woodcutting" }],
        loot: [
          { name: "stick", weight: 60, min: 1, max: 3 },
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
          { name: "fabric", weight: 20, min: 1, max: 2 },
          { name: "leather", weight: 20 },
          { name: "stick", weight: 60 },
        ],
      },
    ],
  }),
];

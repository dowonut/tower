export default {
  regions: [
    {
      name: "slime fields",
      aliases: ["sf", "slime field"],
      description: "Lush rolling fields... with strange slimy creatures everywhere.",
      environment: "world",
      enemies: [
        { name: "small slime", weight: 100 },
        { name: "big slime", weight: 60 },
        { name: "wet slime", weight: 40 },
        { name: "burning slime", weight: 40 },
      ],
      loot: [{ name: "slimeball", weight: 100, min: 1, max: 2 }],
    },
    {
      name: "goblin caves",
      aliases: ["gc", "goblin cave"],
      description: "Dark and gloomy caves filled with pesky goblins. You have been warned.",
      environment: "world",
      enemies: [
        { name: "baby goblin", weight: 100 },
        { name: "hungry goblin", weight: 80 },
        { name: "hobgoblin", weight: 60 },
        { name: "the rock", weight: 10 },
      ],
      loot: [{ name: "rock", weight: 100 }],
    },
    {
      name: "lush forest",
      aliases: ["lf", "lush forests"],
      description:
        "A pleasant forest with a shallow pond. Perfect place to get some wood or do some fishing.",
      environment: "protected",
      activities: [
        { name: "fishing", fish: [{ name: "fish", weight: 100 }] },
        { name: "woodcutting", trees: [{ name: "birch", weight: 100 }] },
      ],
      loot: [
        { name: "stick", weight: 100 },
        { name: "apple", weight: 100 },
      ],
    },
    {
      name: "frog lake",
      aliases: ["fl", "frog lakes"],
      description: "An unassuming lake swarming with frogs of all shapes and sizes.",
      environment: "world",
      enemies: [
        { name: "brown frog", weight: 100 },
        { name: "green frog", weight: 80 },
        { name: "evil frog", weight: 30 },
        { name: "milky frog", weight: 60 },
      ],
      loot: [{ name: "frog tongue", weight: 100 }],
    },
    {
      name: "village",
      aliases: ["v"],
      description:
        "A cozy village with kind people. Might they know something of the floor dungeons?",
      environment: "protected",
      merchants: [
        { category: "general goods" },
        { category: "blacksmith" },
        { category: "cartographer" },
        { category: "alchemist" },
      ],
      loot: [
        { name: "fabric", weight: 100 },
        { name: "leather", weight: 100 },
      ],
    },
  ],
} satisfies FloorData;

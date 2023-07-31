export default {
  regions: [
    {
      name: "slime fields",
      description:
        "Lush rolling fields... with strange slimy creatures everywhere.",
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
      description:
        "Dark and gloomy caves filled with pesky goblins. You have been warned.",
      enemies: [
        { name: "baby goblin", weight: 100 },
        { name: "hungry goblin", weight: 100 },
        { name: "hobgoblin", weight: 50 },
        { name: "the rock", weight: 20 },
      ],
      loot: [{ name: "rock", weight: 100 }],
    },
    {
      name: "lush forest",
      description:
        "A pleasant forest with a shallow pond. Perfect place to get some wood or do some fishing.",
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
      description:
        "An unassuming lake swarming with frogs of all shapes and sizes.",
      enemies: [{ name: "brown frog", weight: 100 }],
      loot: [{ name: "frog tongue", weight: 100 }],
    },
    {
      name: "village",
      description:
        "A cozy village with kind people. Might they know something of the floor dungeons?",
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

export default {
  regions: [
    {
      name: "slime fields",
      description:
        "Lush rolling fields... with strange slimy creatures everywhere.",
      enemies: [
        { name: "small slime", weight: 35 },
        { name: "big slime", weight: 35 },
        { name: "wet slime", weight: 15 },
        { name: "burning slime", weight: 15 },
      ],
      loot: [{ name: "slimeball", weight: 100, min: 1, max: 2 }],
    },
    {
      name: "goblin caves",
      description:
        "Dark and gloomy caves filled with pesky goblins. You have been warned.",
      enemies: [
        { name: "baby goblin", weight: 40 },
        { name: "hungry goblin", weight: 40 },
        { name: "hobgoblin", weight: 20 },
        { name: "the rock", weight: 10 },
      ],
      loot: [{ name: "rock", weight: 100 }],
    },
    {
      name: "lush forest",
      description:
        "A pleasant forest with a shallow pond. Perfect place to get some wood or do some fishing.",
      activities: [{ name: "fishing" }, { name: "woodcutting" }],
      loot: [
        { name: "stick", weight: 90, min: 1, max: 2 },
        { name: "apple", weight: 10 },
      ],
    },
    {
      name: "village",
      description:
        "A cozy village with kind people. Might they know something of the floor dungeons?",
      merchants: [
        { category: "general" },
        { category: "weapons" },
        { category: "cartographer" },
      ],
      loot: [
        { name: "fabric", weight: 50 },
        { name: "leather", weight: 50 },
      ],
    },
  ],
};

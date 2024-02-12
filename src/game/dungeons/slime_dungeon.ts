export default {
  name: "slime dungeon",
  description: "This place is very slimy...",
  dimensions: {
    width: 5,
    height: 3,
  },
  chambers: [
    {
      type: "combat",
      description: "You come across a flock of slimes.",
      id: 1,
      combat: {
        type: "random",
        enemies: [
          { name: "big slime", weight: 80 },
          { name: "small slime", weight: 100 },
          { name: "burning slime", weight: 60 },
          { name: "wet slime", weight: 60 },
        ],
      },
      weight: 100,
    },
    {
      type: "puzzle",
      description: "Solve a silly puzzle.",
      puzzle: {},
      id: 2,
      weight: 40,
    },
    {
      type: "reward",
      description: "You get a cool reward!",
      reward: {},
      id: 3,
      weight: 10,
    },
    {
      type: "respite",
      id: 4,
      weight: 5,
      description: "A chance to heal and calm yourself.",
    },
  ],
  bossChamber: {
    enemies: ["big slime", "decomposing slime", "big slime"],
  },
} as const satisfies DungeonData;

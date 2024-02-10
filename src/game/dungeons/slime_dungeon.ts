export default {
  name: "slime dungeon",
  description: "This place is very slimey...",
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
  ],
  bossChamber: {
    enemies: ["big slime", "decomposing slime", "big slime"],
  },
} as const satisfies DungeonData;

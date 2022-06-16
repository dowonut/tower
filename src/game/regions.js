export const regions = {
  meadows: {
    name: "Meadows",
    minLevel: 0,
    areas: {
      green_village: {
        name: "Green Village",
        description: "🛒",
        minLevel: 0,
      },
      slime_field: {
        name: "Slime Field",
        description: "⚔",
        minLevel: 0,
        enemies: ["small_slime", "medium_slime", "large_slime"],
      },
      small_pond: {
        name: "Small Pond",
        description: "🐟",
        minLevel: 0,
        activities: ["fishing"],
      },
    },
  },
  forest: {
    name: "Forest",
    minLevel: 10,
  },
};

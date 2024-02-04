export default {
  // The name of the item (lowercase).
  name: "slime dungeon map",
  // The category of the item (weapon, food, etc).
  category: "map",
  // Item description. Short and shown in lists.
  description: "A map to the Slime Dungeon.",
  // Item info. Long and shown in "iteminfo".
  info: "A map leading to the dungeon located in the slime fields. Beware of slimes!",
  // Dungeon the map leads to. Only use if item category is map.
  dungeon: { name: "slime dungeon" },
} as const satisfies ItemData;

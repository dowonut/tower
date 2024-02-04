export default {
  // The name of the item (lowercase).
  name: "apple",
  // The category of the item (weapon, food, etc).
  category: "food",
  // Item description. Short and shown in lists.
  description: "A tasty apple.",
  // Item info. Long and shown in "iteminfo".
  info: "A tasty apple you found lying on the ground somewhere...",
  // Health regained if food item.
  health: 5,
} as const satisfies ItemData;

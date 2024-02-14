export default {
  name: "rusty sword",
  category: "weapon",
  info: "An old rusty sword. Use it wisely before it falls apart.",
  weapon: { type: "sword", equipSlot: "hand" },
} as const satisfies ItemData;

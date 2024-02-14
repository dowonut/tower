export default {
  name: "sturdy sword",
  category: "weapon",
  info: "A sturdy steel sword.",
  weapon: { type: "sword", equipSlot: "hand", baseLevel: 3 },
} as const satisfies ItemData;

export default {
  name: "sturdy sword",
  category: "weapon",
  weaponType: "sword",
  info: "A sturdy steel sword.",
  equipSlot: "hand",
  stats: {
    baseLevel: 3,
  },
} as const satisfies ItemData;

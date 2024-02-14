export default {
  name: "rusty shield",
  category: "weapon",
  info: "It's better than nothing at least.",
  weapon: { type: "shield", equipSlot: "hand" },
} as const satisfies ItemData;

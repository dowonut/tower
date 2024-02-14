export default {
  name: "dusty stick",
  category: "weapon",
  info: "The blacksmith thought this was just an old broom.",
  weapon: { type: "staff", equipSlot: "hand" },
} as const satisfies ItemData;

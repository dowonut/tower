export default {
  name: "rusty hammer",
  category: "weapon",
  info: "You could use it to hammer nails.",
  weapon: { type: "hammer", equipSlot: "hand" },
} as const satisfies ItemData;

export default {
  name: "orange",
  description: "An orange orange.",
  info: "What's the difference between an apple and an orange?",
  category: "consumable",
  consumable: {
    type: "food",
    effects: {
      type: "heal",
      amount: 10,
    },
  },
} as const satisfies ItemData;

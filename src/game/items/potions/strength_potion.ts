export default {
  name: "strength potion",
  category: "potion",
  description: "Makes you super strong and shit.",
  info: `A viscous substance that gives you an urge to hit things.`,
  // Passive effects if potion
  effects: [{ name: "strengthened" }],
} as const satisfies ItemData;

export default {
  name: "rare strength potion",
  category: "potion",
  description: "Makes you super strong and shit.",
  info: `A viscous substance that gives you an urge to hit things.`,
  effects: [{ name: "strength" }],
} as const satisfies ItemData;

export default {
  name: "rare strength potion",
  category: "consumable",
  description: "Makes you super strong and shit.",
  info: `A viscous substance that gives you an urge to hit things.`,
  consumable: {
    effects: [{ type: "apply_status_effect", name: "strengthened", level: 1 }],
    type: "potion",
  },
} as const satisfies ItemData;

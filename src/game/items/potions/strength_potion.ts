export default {
  name: "strength potion",
  category: "consumable",
  description: "Makes you super strong and shit.",
  info: `A viscous substance that gives you an urge to hit things.`,
  consumable: { effects: [{ type: "apply_status_effect", name: "strengthened" }], type: "potion" },
} as const satisfies ItemData;

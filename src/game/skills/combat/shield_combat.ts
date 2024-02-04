export default {
  name: "shield combat",
  category: "combat",
  weaponType: "shield",
  levels: [
    { rewards: [{ type: "unlockAction", action: "bash" }] },
    { rewards: [{ type: "unlockAction", action: "slam" }] },
  ],
} as const satisfies SkillData;

export default {
  name: "halberd combat",
  category: "combat",
  weaponType: "halberd",
  levels: [
    { rewards: [{ type: "unlockAction", action: "sweep" }] },
    { rewards: [{ type: "unlockAction", action: "lunge" }] },
  ],
} as const satisfies SkillData;

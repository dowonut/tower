export default {
  name: "bow combat",
  category: "combat",
  weaponType: "bow",
  levels: [
    { rewards: [{ type: "unlockAction", action: "shoot" }] },
    { rewards: [{ type: "unlockAction", action: "multishot" }] },
  ],
} as const satisfies SkillData;

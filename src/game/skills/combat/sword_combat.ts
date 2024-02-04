export default {
  name: "sword combat",
  category: "combat",
  weaponType: "sword",
  levels: [
    // Level 0
    { rewards: [{ type: "unlockAction", action: "slash" }] },
    // Level 1
    { rewards: [{ type: "unlockAction", action: "thrust" }] },
  ],
} as const satisfies SkillData;

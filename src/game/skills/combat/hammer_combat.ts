export default {
  name: "hammer combat",
  category: "combat",
  weaponType: "hammer",
  levels: [
    { rewards: [{ type: "unlockAction", action: "smash" }] },
    { rewards: [{ type: "unlockAction", action: "big smash" }] },
  ],
} as const satisfies SkillData;

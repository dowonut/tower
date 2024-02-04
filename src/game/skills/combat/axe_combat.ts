export default {
  name: "axe combat",
  category: "combat",
  weaponType: "axe",
  levels: [
    { rewards: [{ type: "unlockAction", action: "chop" }] },
    { rewards: [{ type: "unlockAction", action: "cleave" }] },
  ],
} as const satisfies SkillData;

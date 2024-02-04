export default {
  name: "staff combat",
  category: "combat",
  weaponType: "staff",
  levels: [
    { rewards: [{ type: "unlockAction", action: "bonk" }] },
    { rewards: [{ type: "unlockAction", action: "spin whack" }] },
  ],
} as const satisfies SkillData;

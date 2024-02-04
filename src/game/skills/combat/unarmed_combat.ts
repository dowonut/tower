export default {
  name: "unarmed combat",
  category: "combat",
  weaponType: "unarmed",
  levels: [
    { rewards: [{ type: "unlockAction", action: "punch" }] },
    { rewards: [{ type: "unlockAction", action: "uppercut" }] },
  ],
} as const satisfies SkillData;

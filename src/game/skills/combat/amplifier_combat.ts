export default {
  name: "amplifier combat",
  category: "combat",
  weaponType: "amplifier",
  levels: [{ rewards: [{ type: "unlockAction", action: "slap" }] }],
} as const satisfies SkillData;

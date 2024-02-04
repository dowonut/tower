export default {
  name: "spear combat",
  category: "combat",
  weaponType: "spear",
  levels: [
    { rewards: [{ type: "unlockAction", action: "poke" }] },
    { rewards: [{ type: "unlockAction", action: "vaulting poke" }] },
  ],
} as const satisfies SkillData;

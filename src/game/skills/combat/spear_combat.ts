export default {
  name: "spear combat",
  category: "combat",
  weaponType: "spear",
  levels: [
    { rewards: [{ type: "unlockAttack", attack: "poke" }] },
    { rewards: [{ type: "unlockAttack", attack: "vaulting poke" }] },
  ],
} satisfies SkillData;

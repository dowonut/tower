export default {
  name: "unarmed combat",
  category: "combat",
  weaponType: "unarmed",
  levels: [
    { rewards: [{ type: "unlockAttack", attack: "punch" }] },
    { rewards: [{ type: "unlockAttack", attack: "uppercut" }] },
  ],
} satisfies SkillData;

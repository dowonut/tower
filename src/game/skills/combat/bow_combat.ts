export default {
  name: "bow combat",
  category: "combat",
  weaponType: "bow",
  levels: [
    { rewards: [{ type: "unlockAttack", attack: "shoot" }] },
    { rewards: [{ type: "unlockAttack", attack: "multishot" }] },
  ],
} satisfies SkillData;

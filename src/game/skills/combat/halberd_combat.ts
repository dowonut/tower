export default {
  name: "halberd combat",
  category: "combat",
  weaponType: "halberd",
  levels: [
    { rewards: [{ type: "unlockAttack", attack: "sweep" }] },
    { rewards: [{ type: "unlockAttack", attack: "lunge" }] },
  ],
} satisfies SkillData;

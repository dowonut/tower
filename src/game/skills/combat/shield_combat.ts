export default {
  name: "shield combat",
  category: "combat",
  weaponType: "shield",
  levels: [
    { rewards: [{ type: "unlockAttack", attack: "bash" }] },
    { rewards: [{ type: "unlockAttack", attack: "slam" }] },
  ],
} satisfies SkillData;

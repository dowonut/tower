export default {
  name: "axe combat",
  category: "combat",
  weaponType: "axe",
  levels: [
    { rewards: [{ type: "unlockAttack", attack: "chop" }] },
    { rewards: [{ type: "unlockAttack", attack: "cleave" }] },
  ],
} satisfies SkillData;

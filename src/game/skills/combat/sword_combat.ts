export default {
  name: "sword combat",
  category: "combat",
  weaponType: "sword",
  levels: [
    // Level 0
    { rewards: [{ type: "unlockAttack", attack: "slash" }] },
    // Level 1
    { rewards: [{ type: "unlockAttack", attack: "thrust" }] },
  ],
} satisfies SkillData;

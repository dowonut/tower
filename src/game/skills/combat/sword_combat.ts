export default {
  name: "sword combat",
  category: "combat",
  weaponType: "sword",
  levels: [
    { rewards: [{ type: "unlockAttack", attack: "slash" }] },
    { rewards: [{ type: "unlockAttack", attack: "thrust" }] },
  ],
} satisfies SkillData;

export default {
  name: "staff combat",
  category: "combat",
  weaponType: "staff",
  levels: [
    { rewards: [{ type: "unlockAttack", attack: "bonk" }] },
    { rewards: [{ type: "unlockAttack", attack: "spin whack" }] },
  ],
} satisfies SkillData;

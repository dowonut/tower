export default {
  name: "hammer combat",
  category: "combat",
  weaponType: "hammer",
  levels: [
    { rewards: [{ type: "unlockAttack", attack: "smash" }] },
    { rewards: [{ type: "unlockAttack", attack: "big smash" }] },
  ],
} satisfies SkillData;

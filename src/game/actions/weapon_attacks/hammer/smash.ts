export default {
  name: "smash",
  description: "Smash the enemy with your hammer.",
  type: "weapon_attack",
  requiredWeapon: ["hammer"],
  effects: [
    {
      type: "damage",
      damage: { type: "bludgeoning", source: "ATK", basePercent: 50 },
      messages: ["PLAYER smashes ENEMY with their hammer, dealing DAMAGE"],
    },
  ],
} satisfies ActionData;

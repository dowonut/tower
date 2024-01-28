export default {
  name: "smash",
  description: "Smash the enemy with your hammer.",
  weaponType: ["hammer"],
  damage: [{ type: "bludgeoning", source: "ATK", basePercent: 50 }],
  messages: ["PLAYER smashes ENEMY with their hammer, dealing DAMAGE"],
} satisfies AttackData;

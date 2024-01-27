export default {
  name: "bash",
  weaponType: ["shield"],
  description: "Bash the enemy with your shield.",
  damage: [{ type: "bludgeoning", source: "ATK", basePercent: 50 }],
  messages: ["PLAYER bashes ENEMY with their shield, dealing DAMAGE"],
} satisfies AttackData;

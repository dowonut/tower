export default {
  name: "bash",
  weaponType: ["shield"],
  description: "Slam into the enemy with your shield.",
  damage: [{ type: "bludgeoning", source: "ATK", basePercent: 50 }],
  messages: ["PLAYER sprints and slams into ENEMY, dealing DAMAGE"],
} satisfies AttackData;

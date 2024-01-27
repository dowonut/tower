export default {
  name: "slam",
  weaponType: ["shield"],
  description: "Slam into the enemy with your shield.",
  damage: [{ type: "bludgeoning", source: "ATK", basePercent: 70 }],
  messages: [
    "PLAYER sprints and slams into ENEMY, dealing DAMAGE",
    "PLAYER leaps into the air and lands on ENEMY with their shield, dealing DAMAGE",
  ],
} satisfies AttackData;

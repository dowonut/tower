export default {
  // Name of enemy (lowercase).
  name: "hungry goblin",
  // Class the enemy belongs to
  type: "goblin",
  // Description shown in "enemyinfo".
  description: "Careful... they're dangerous when they're hungry.",
  // Max health.
  maxHealth: 8,
  // Enemy level. Used to scale attack power.
  level: 3,
  // All anime attacks. Available attacks can be seen in enemy class.
  attacks: ["scratch", "punch"],
  // Enemy loot table. Item names and drops.
  loot: [{ name: "goblin skin", dropChance: 100, min: 1, max: 2 }],
  // How much xp the enemy gives when killed.
  xp: 10,
} as EnemyData;

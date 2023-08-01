export default {
  // Name of enemy (lowercase).
  name: "the rock",
  // Class the enemy belongs to
  type: "rock",
  // Description shown in "enemyinfo".
  description: "Rock.",
  // Max health.
  baseHP: 30,
  // Enemy level. Used to scale attack power.
  level: 8,
  // All anime attacks. Available attacks can be seen in enemy class.
  attacks: ["smash"],
  // Enemy loot table. Item names and drops.
  loot: [{ name: "rock", dropChance: 100, min: 30, max: 50 }],
  // How much xp the enemy gives when killed.
  xp: 500,
} as EnemyData;

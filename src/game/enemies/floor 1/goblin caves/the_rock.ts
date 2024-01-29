export default {
  // Name of enemy (lowercase).
  name: "the rock",
  // Class the enemy belongs to
  type: "rock",
  // Description shown in "enemyinfo".
  description: "Rock.",
  // Enemy level. Used to scale attack power.
  level: 8,
  // All anime attacks. Available attacks can be seen in enemy class.
  actions: ["smash"],
  // Enemy loot table. Item names and drops.
  loot: [{ name: "rock", dropChance: 100, min: 30, max: 50 }],
} satisfies EnemyData;

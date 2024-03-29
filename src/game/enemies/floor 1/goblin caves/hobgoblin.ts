export default {
  // Name of enemy (lowercase).
  name: "hobgoblin",
  // Class the enemy belongs to
  type: "goblin",
  // Description shown in "enemyinfo".
  description: "Do not enrage the hobgoblin. Bad idea.",
  // Enemy level. Used to scale attack power.
  level: 5,
  // All anime attacks. Available attacks can be seen in enemy class.
  actions: ["scratch", "punch", "club"],
  // Enemy loot table. Item names and drops.
  loot: [{ name: "goblin skin", dropChance: 100, min: 2, max: 3 }],
} as const satisfies EnemyData;

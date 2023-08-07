export default {
  // Name of enemy (lowercase).
  name: "baby goblin",
  // Class the enemy belongs to
  type: "goblin",
  // Description shown in "enemyinfo".
  description: "Do not be fooled by its cute appearance. It will gladly eat you alive.",
  // Enemy level. Used to scale attack power.
  level: 2,
  // All anime attacks. Available attacks can be seen in enemy class.
  attacks: ["scratch", "punch"],
  // Enemy loot table. Item names and drops.
  loot: [{ name: "goblin skin", dropChance: 100, min: 1, max: 1 }],
} satisfies EnemyData;

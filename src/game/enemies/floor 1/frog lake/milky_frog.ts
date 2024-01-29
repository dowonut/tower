export default {
  // Name of enemy (lowercase).
  name: "milky frog",
  // Class the enemy belongs to
  type: "frog",
  // Description shown in "enemyinfo".
  description: "This frog is covered in a strange white substance. Milk. It's milk.",
  // Enemy level. Used to scale attack power.
  level: 8,
  // All anime attacks. Available attacks can be seen in enemy class.
  actions: ["lick", "milky splash"],
  // Enemy loot table. Item names and drops.
  loot: [{ name: "frog tongue", dropChance: 100, min: 1, max: 2 }],
} satisfies EnemyData;

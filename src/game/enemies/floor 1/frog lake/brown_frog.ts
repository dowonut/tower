export default {
  // Name of enemy (lowercase).
  name: "brown frog",
  // Class the enemy belongs to
  type: "frog",
  // Description shown in "enemyinfo".
  description: "He looks like a silly little guy... but is he?",
  // Enemy level. Used to scale attack power.
  level: 5,
  // All anime attacks. Available attacks can be seen in enemy class.
  attacks: ["lick"],
  // Enemy loot table. Item names and drops.
  loot: [{ name: "frog tongue", dropChance: 100, min: 1, max: 2 }],
} satisfies EnemyData;

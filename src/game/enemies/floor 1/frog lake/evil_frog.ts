export default {
  name: "evil frog",
  description: "This frog is extremely evil.",
  level: 10,
  actions: ["lick", "malicious lick"],
  type: "frog",
  stats: { SPD: 90 },
  loot: [{ name: "frog tongue", dropChance: 100, min: 1, max: 3 }],
} as const satisfies EnemyData;

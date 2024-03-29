export default {
  name: "wet slime",
  type: "slime",
  description: "Somehow wet instead of sticky.",
  level: 2,
  strong: ["water"],
  weak: ["fire"],
  actions: ["swallow", "bounce", "drown"],
  loot: [{ name: "slimeball", dropChance: 100, min: 1, max: 2 }],
} as const satisfies EnemyData;

export default {
  name: "burning slime",
  type: "slime",
  description: "The slime is constantly on fire... how?",
  level: 2,
  strong: ["fire"],
  weak: ["water"],
  actions: ["swallow", "bounce", "burn"],
  loot: [{ name: "slimeball", dropChance: 50, min: 1, max: 2 }],
  shard: { dropChance: 20, type: "grey" },
} satisfies EnemyData;

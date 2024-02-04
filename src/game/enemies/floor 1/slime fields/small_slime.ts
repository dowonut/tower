export default {
  name: "small slime",
  type: "slime",
  description: "A cute little guy. Would be a shame if you killed him.",
  level: 1,
  actions: ["bounce"],
  loot: [{ name: "slimeball", dropChance: 100, min: 1, max: 2 }],
} as const satisfies EnemyData;

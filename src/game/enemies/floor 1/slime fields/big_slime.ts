export default {
  name: "big slime",
  type: "slime",
  description: "How did a slime get this large? Try not to get swallowed.",
  level: 3,
  attacks: ["swallow", "bounce"],
  loot: [{ name: "slimeball", dropChance: 100, min: 2, max: 4 }],
} satisfies EnemyData;

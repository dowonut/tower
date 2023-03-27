export default {
  name: "big slime",
  class: "slime",
  description: "How did a slime get this large? Try not to get swallowed.",
  maxHealth: 5,
  level: 3,
  attacks: ["swallow", "bounce"],
  loot: [{ name: "slimeball", dropChance: 100, min: 2, max: 4 }],
  xp: 30,
} satisfies EnemyData;

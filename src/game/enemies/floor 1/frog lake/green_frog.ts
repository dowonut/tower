export default {
  name: "green frog",
  type: "frog",
  description: "This one almost looks like a real frog.",
  level: 7,
  actions: ["lick"],
  loot: [{ name: "frog tongue", dropChance: 60, min: 1, max: 2 }],
} satisfies EnemyData;

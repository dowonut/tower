export default {
  name: "decomposing slime",
  description: "This strange ball of green slime appears to be... decomposing?",
  level: 5,
  type: "greater slime",
  actions: ["spit slime"],
  isBoss: true,
} as const satisfies EnemyData;

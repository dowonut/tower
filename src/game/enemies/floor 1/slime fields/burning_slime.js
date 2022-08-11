export default {
  name: "burning slime",
  class: "slime",
  description: "The slime is constantly on fire... how?",
  maxHealth: 4,
  level: 2,
  strong: ["fire"],
  weak: ["water"],
  attacks: ["swallow", "bounce", "burn"],
  loot: [{ name: "slimeball", dropChance: 50, min: 1, max: 2 }],
  shard: { dropChance: 20, type: "grey" },
  xp: 30,
};

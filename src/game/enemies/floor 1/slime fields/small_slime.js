export default {
  name: "small slime",
  class: "slime",
  description: "A cute little guy. Would be a shame if you killed him.",
  maxHealth: 3,
  level: 1,
  attacks: ["swallow", "bounce"],
  loot: [{ name: "slimeball", dropChance: 100, min: 1, max: 2 }],
  xp: 10,
};

export default {
  name: "wet slime",
  class: "slime",
  description: "Somehow wet instead of sticky.",
  maxHealth: 4,
  level: 2,
  strong: ["water"],
  weak: ["fire"],
  attacks: ["swallow", "bounce", "drown"],
  loot: [{ name: "slimeball", dropChance: 100, min: 1, max: 2 }],
  xp: 30,
};

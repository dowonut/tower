export default {
  // Name of enemy (lowercase).
  name: "",
  // Description shown in "enemyinfo".
  description: "",
  // Max health.
  maxHealth: 0,
  // Enemy level. Used to scale attack power.
  level: 0,
  // All anime attacks. Available attacks can be seen in enemy class.
  attacks: [{ name: "" }],
  // Enemy loot table. Item names and drops.
  loot: [{ name: "", dropChance: 0, min: 0, max: 0 }],
  // How much xp the enemy gives when killed.
  xp: {
    min: 0,
    max: 0,
  },
};

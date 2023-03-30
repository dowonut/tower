export default {
  name: "strength potion",
  category: "potion",
  description: "Makes you super strong and shit.",
  info: `A viscous substance that gives you an urge to hit things.`,
  // Passive effects if potion
  effects: [
    {
      // Type of effect (passive, health, etc)
      type: "passive",
      // What the modifier applies to (all combat, sword combat, etc)
      filter: "all",
      // What it modifies (damage, crit rate, crit damage)
      target: "damage",
      // How to modify (multiply, add)
      modifier: "multiply",
      // The value of the modification
      value: 50,
      // Optional duration (combat rounds)
      duration: 1,
      // Potion info
      info: "Increase damage by `+50%` for `1` round",
    },
  ],
} satisfies ItemData;

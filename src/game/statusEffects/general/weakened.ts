export default {
  name: "weakened",
  description: "Weakens the target, decreasing their maximum health.",
  evaluateOn: "immediate",
  // duration: 3,
  stackable: false,
  outcomes: [
    {
      type: "modify_stat",
      messages: ["HOST is weakened and their max HP is decreased by **20%**"],
      modifyStat: {
        stat: "maxHP",
        type: "multiplier",
        basePercent: -20,
      },
    },
  ],
} as const satisfies StatusEffectData;
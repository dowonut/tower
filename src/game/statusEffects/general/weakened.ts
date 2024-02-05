export default {
  name: "weakened",
  type: "debuff",
  description: "Weakens the target, decreasing their maximum health.",
  evaluateOn: "passive",
  duration: 3,
  stackable: false,
  outcomes: [
    {
      type: "modify_stat",
      messages: ["HOST is weakened and their max HP is decreased by **20%**"],
      modifyStat: {
        stat: "maxHP",
        scaling: "percent",
        basePercent: -20,
      },
    },
  ],
} as const satisfies StatusEffectData;

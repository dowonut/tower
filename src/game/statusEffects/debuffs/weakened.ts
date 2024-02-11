export default {
  name: "weakened",
  type: "debuff",
  description: "Weakens the target, decreasing their maximum health.",
  evaluateOn: "passive",
  duration: 2,
  stackable: false,
  outcomes: [
    {
      type: "modify_stat",
      modifyStat: {
        stat: "maxHP",
        scaling: "percent",
        basePercent: -10,
      },
    },
  ],
} as const satisfies StatusEffectData;

export default {
  name: "wet",
  description: "The target is wet.",
  type: "debuff",
  duration: 2,
  evaluateOn: "passive",
  stackable: false,
  outcomes: [
    {
      type: "modify_stat",
      modifyStat: [
        {
          stat: "SPD",
          scaling: "percent",
          basePercent: -20,
        },
        {
          scaling: "flat",
          stat: "fire_RES",
          baseFlat: 10,
        },
      ],
    },
  ],
} as const satisfies StatusEffectData;

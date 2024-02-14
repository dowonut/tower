export default {
  name: "invigorated",
  description: "Makes the target feel invigorated, increasing their speed and attack.",
  type: "buff",
  duration: 1,
  evaluateOn: "turn_end",
  outcomes: [
    {
      type: "modify_stat",
      modifyStat: [
        {
          stat: "SPD",
          scaling: "percent",
          basePercent: 10,
        },
        {
          stat: "ATK",
          scaling: "percent",
          basePercent: 10,
        },
      ],
      levelScaling: 10,
    },
  ],
} as const satisfies StatusEffectData;

export default {
  name: "god",
  description: "Become god.",
  type: "buff",
  duration: 10,
  evaluateOn: "immediate",
  outcomes: [
    {
      type: "modify_health",
      messages: [""],
      modifyHealth: {
        scaling: "percent",
        statSource: "host",
        basePercent: 100,
        scalingStat: "health",
      },
    },
    {
      type: "damage",
      messages: [""],
      damage: {
        type: "void",
        scalingStat: "SPC",
        statSource: "host",
        basePercent: 5,
        scaling: "percent",
      },
    },
    {
      type: "modify_speed_gauge",
      messages: [""],
      modifySpeedGauge: {
        type: "forward",
        percent: 100,
      },
    },
    {
      type: "modify_stat",
      messages: [""],
      modifyStat: [
        {
          scaling: "percent",
          stat: "ATK",
          basePercent: 100,
        },
        {
          scaling: "percent",
          stat: "MAG",
          basePercent: 100,
        },
        {
          scaling: "percent",
          stat: "SPC",
          basePercent: 100,
        },
      ],
    },
  ],
} as const satisfies StatusEffectData;

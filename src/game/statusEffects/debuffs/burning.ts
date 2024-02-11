export default {
  name: "burning",
  description: "The target is on fire. Usually, this is not ideal.",
  type: "debuff",
  duration: 2,
  evaluateOn: "turn_start",
  outcomes: [
    {
      type: "damage",
      messages: [
        "HOST is currently on fire and takes DAMAGE",
        "HOST is actively on fire and takes DAMAGE",
        "HOST is in a bit of a burning predicament, causing them to take DAMAGE",
        "HOST's body is going up in flames, causing them to take DAMAGE",
      ],
      damage: {
        type: "fire",
        scaling: "percent",
        scalingStat: "health",
        statSource: "host",
        basePercent: 10,
      },
    },
  ],
} as const satisfies StatusEffectData;

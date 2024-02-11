export default {
  name: "bleeding",
  type: "debuff",
  description: "Causes the target to bleed.",
  duration: 2,
  evaluateOn: "turn_start",
  outcomes: [
    {
      type: "damage",
      damage: [
        {
          type: "slashing",
          scaling: "percent",
          statSource: "host",
          scalingStat: "health",
          basePercent: 5,
          resStat: "SPC_RES",
        },
        {
          type: "slashing",
          scaling: "percent",
          scalingStat: "SPC",
          basePercent: 5,
        },
      ],
      messages: ["HOST bleeds, taking DAMAGE"],
    },
  ],
} as const satisfies StatusEffectData;

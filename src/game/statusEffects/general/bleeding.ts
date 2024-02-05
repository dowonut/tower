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
          statSource: "host",
          scalingStat: "health",
          basePercent: 10,
          resStat: "SPC_RES",
        },
        {
          type: "slashing",
          scalingStat: "SPC",
          basePercent: 10,
        },
      ],
      messages: ["HOST bleeds, taking DAMAGE"],
    },
  ],
} as const satisfies StatusEffectData;

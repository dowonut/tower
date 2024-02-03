export default {
  name: "bleed",
  description: "Makes the target bleed.",
  duration: 2,
  evaluateOn: "turn_start",
  outcomes: [
    {
      type: "damage",
      damage: [
        {
          type: "slashing",
          statSource: "host",
          source: "health",
          basePercent: 10,
          resStat: "SPC_RES",
        },
        {
          type: "slashing",
          source: "SPC",
          basePercent: 10,
        },
      ],
      messages: ["HOST bleeds, taking DAMAGE"],
    },
  ],
} satisfies StatusEffectData;

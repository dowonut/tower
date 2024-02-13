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
          scalingStat: "maxHP",
          basePercent: 10,
          resStat: "SPC_RES",
        },
      ],
      messages: ["HOST bleeds, taking DAMAGE"],
    },
  ],
} as const satisfies StatusEffectData;

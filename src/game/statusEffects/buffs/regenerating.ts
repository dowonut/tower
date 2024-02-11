export default {
  name: "regenerating",
  type: "buff",
  description: "Makes the target regenerate health over time.",
  duration: 3,
  evaluateOn: "turn_start",
  stackable: false,
  outcomes: [
    {
      type: "modify_health",
      modifyHealth: [
        {
          scaling: "percent",
          scalingStat: "maxHP",
          statSource: "source",
          basePercent: 20,
        },
        { scaling: "flat", baseFlat: 10 },
      ],
      messages: [
        "HOST's wounds close and they regain HEAL",
        "HOST regenerates and regains HEAL",
        "HOST feels much better, healing HEALTH",
      ],
    },
  ],
} as const satisfies StatusEffectData;

export default {
  name: "regenerating",
  description: "Makes the target regenerate health over time.",
  duration: 3,
  evaluateOn: "turn_start",
  outcomes: [
    {
      type: "modify_health",
      modifyHealth: [
        {
          scaling: "percent",
          source: "health",
          statSource: "host",
          basePercent: 20,
        },
        { scaling: "flat", baseFlat: 10 },
      ],
      messages: ["HOST is regenerated and regains HEALING"],
    },
  ],
} as const satisfies StatusEffectData;

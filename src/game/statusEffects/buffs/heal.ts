export default {
  name: "heal",
  description: "Simply heals the target.",
  type: "buff",
  duration: 1,
  evaluateOn: "immediate",
  outcomes: [
    {
      type: "modify_health",
      messages: ["HOST "],
      modifyHealth: {
        scaling: "flat",
        baseFlat: 10,
      },
      levelScaling: 10,
    },
  ],
} as const satisfies StatusEffectData;

export default {
  name: "full heal",
  description: "Heal the target to max health.",
  type: "buff",
  duration: 1,
  evaluateOn: "immediate",
  outcomes: [
    {
      type: "modify_health",
      messages: ["HOST is immediately healed to full health."],
      modifyHealth: {
        scaling: "percent",
        scalingStat: "maxHP",
        statSource: "host",
        basePercent: 100,
      },
    },
  ],
} as const satisfies StatusEffectData;

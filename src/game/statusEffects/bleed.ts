export default {
  name: "bleed",
  description: "Make your target bleed.",
  duration: 2,
  evaluateOn: "turn_start",
  outcomes: [
    {
      type: "damage",
      damage: { type: "slashing", statSource: "host", source: "health", basePercent: 10 },
    },
  ],
} satisfies StatusEffectData;

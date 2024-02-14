export default {
  name: "strengthened",
  type: "buff",
  description: "Imbues the target with a surge of strength.",
  duration: 2,
  evaluateOn: "turn_end",
  outcomes: [
    {
      type: "modify_stat",
      modifyStat: {
        stat: "ATK",
        scaling: "percent",
        basePercent: 20,
      },
      levelScaling: 10,
    },
  ],
} as const satisfies StatusEffectData;

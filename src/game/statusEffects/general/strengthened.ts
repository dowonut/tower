export default {
  name: "strengthened",
  type: "buff",
  description: "Imbues the target with a surge of strength.",
  duration: 2,
  evaluateOn: "passive",
  outcomes: [
    {
      type: "modify_stat",
      messages: ["TARGET is strengthened! Their ATK is increased by **20%**"],
      modifyStat: {
        stat: "ATK",
        scaling: "percent",
        basePercent: 20,
      },
    },
  ],
} as const satisfies StatusEffectData;

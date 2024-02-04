export default {
  name: "strengthened",
  description: "Imbues the target with a surge of strength.",
  duration: 2,
  evaluateOn: "turn_start",
  outcomes: [
    {
      type: "modify_stat",
      messages: ["TARGET is strengthened! Their ATK is increased by **20%**"],
      modifyStat: {
        stat: "ATK",
        type: "multiplier",
        basePercent: 20,
      },
    },
  ],
} as const satisfies StatusEffectData;

export default {
  name: "dazed",
  description: "The target is dazed, making it harder for them to hit things.",
  type: "debuff",
  duration: 1,
  evaluateOn: "passive",
  stackable: false,
  outcomes: [
    {
      type: "modify_stat",
      modifyStat: [
        { scaling: "percent", stat: "ATK", basePercent: -50 },
        { scaling: "percent", stat: "MAG", basePercent: -50 },
        { scaling: "percent", stat: "SPC", basePercent: -50 },
      ],
    },
  ],
} as const satisfies StatusEffectData;

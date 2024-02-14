export default {
  name: "stunned",
  type: "debuff",
  description: "Stuns the target, delaying their next turn.",
  duration: 1,
  evaluateOn: "immediate",
  outcomes: [
    {
      type: "modify_speed_gauge",
      modifySpeedGauge: { percent: 60, type: "delay" },
      levelScaling: 10,
    },
  ],
} as const satisfies StatusEffectData;

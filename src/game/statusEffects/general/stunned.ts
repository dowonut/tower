export default {
  name: "stunned",
  type: "debuff",
  description: "Stuns the target, delaying their next turn.",
  duration: 1,
  evaluateOn: "immediate",
  outcomes: [
    {
      type: "modify_speed_gauge",
      messages: ["HOST is stunned, delaying their next action by **100%**"],
      modifySpeedGauge: { percent: 100, type: "delay" },
    },
  ],
} as const satisfies StatusEffectData;

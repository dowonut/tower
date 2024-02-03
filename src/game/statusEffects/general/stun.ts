export default {
  name: "stun",
  description: "Stuns the target, delaying their next turn.",
  duration: 1,
  evaluateOn: "immediate",
  outcomes: [
    {
      type: "modify_speed_gauge",
      messages: ["HOST is stunned, delaying their next action by **80%**"],
      modifySpeedGauge: { percent: 80, type: "delay" },
    },
  ],
} satisfies StatusEffectData;

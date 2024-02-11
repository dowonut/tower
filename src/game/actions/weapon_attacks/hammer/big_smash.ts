export default {
  name: "big smash",
  description: "Do a big smash with your hammer.",
  type: "weapon_attack",
  requiredWeapon: ["hammer"],
  cooldown: 1,
  outcomes: [
    {
      type: "damage",
      damage: { type: "bludgeoning", scalingStat: "ATK", basePercent: 50, scaling: "percent" },
      targetType: "single",
      messages: ["SOURCE runs up and smashes TARGET with their big fat hammer, dealing DAMAGE"],
    },
    {
      type: "damage",
      damage: [{ type: "bludgeoning", scalingStat: "ATK", basePercent: 10, scaling: "percent" }],
      targetType: "adjacent",
      messages: ["SOURCE's smash causes a shockwave, dealing DAMAGE to TARGET"],
    },
    {
      type: "apply_status",
      targetType: "all",
      status: {
        name: "stunned",
      },
      messages: ["The shockwave from SOURCE's smash also shocks TARGET, inflicting STATUS"],
    },
  ],
} as const satisfies ActionData;

export default {
  name: "big smash",
  description: "Do a big smash with your hammer.",
  type: "weapon_attack",
  requiredWeapon: ["hammer"],
  cooldown: 1,
  outcomes: [
    {
      type: "damage",
      damage: { type: "bludgeoning", source: "ATK", basePercent: 50 },
      targetType: "single",
      messages: ["SOURCE runs up and smashes TARGET with their big fat hammer, dealing DAMAGE"],
    },
    {
      type: "damage",
      damage: [{ type: "bludgeoning", source: "ATK", basePercent: 10 }],
      targetType: "adjacent",
      messages: ["SOURCE's smash causes a shockwave, dealing DAMAGE to TARGET"],
    },
    {
      type: "apply_status",
      status: {
        type: "fixed",
        name: "stagger",
      },
      messages: [
        "The shockwave from SOURCE's smash also causes TARGET to stagger, inflicting STATUS",
      ],
    },
  ],
} satisfies ActionData;

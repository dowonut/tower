export default {
  name: "big smash",
  description: "Do a big smash with your hammer.",
  type: "weapon_attack",
  requiredWeapon: ["hammer"],
  cooldown: 2,
  effects: [
    {
      type: "damage",
      damage: { type: "bludgeoning", source: "ATK", basePercent: 50 },
      targetType: "single",
      messages: ["PLAYER runs up and smashes ENEMY with their big fat hammer, dealing DAMAGE"],
    },
    {
      type: "damage",
      damage: [
        { type: "bludgeoning", source: "ATK", basePercent: 10 },
        { type: "earth", source: "MAG", basePercent: 10 },
      ],
      targetType: "adjacent",
      messages: ["PLAYER's smash causes a shockwave, dealing DAMAGE to ENEMY"],
    },
    {
      type: "apply_status",
      status: {
        type: "fixed",
        name: "stagger",
      },
      messages: [
        "The shockwave from PLAYER's smash also causes ENEMY to stagger, inflicting STATUS",
      ],
    },
  ],
} satisfies ActionData;

export default {
  name: "slam",
  requiredWeapon: ["shield"],
  description: "Slam into the enemy with your shield.",
  type: "weapon_attack",
  cooldown: 1,
  outcomes: [
    {
      type: "damage",
      damage: { type: "bludgeoning", scalingStat: "ATK", basePercent: 50 },
      messages: [
        "SOURCE sprints and slams into TARGET, dealing DAMAGE",
        "SOURCE leaps into the air and lands on TARGET with their shield, dealing DAMAGE",
      ],
    },
    {
      type: "damage",
      targetType: "adjacent",
      damage: { type: "bludgeoning", scalingStat: "ATK", basePercent: 10 },
      messages: ["SOURCE's slam also knocks over TARGET, dealing DAMAGE"],
    },
  ],
} as const satisfies ActionData;

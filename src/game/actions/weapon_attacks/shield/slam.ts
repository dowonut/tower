export default {
  name: "slam",
  requiredWeapon: ["shield"],
  description: "Slam into the enemy with your shield.",
  type: "weapon_attack",
  effects: [
    {
      type: "damage",
      damage: { type: "bludgeoning", source: "ATK", basePercent: 70 },
      messages: [
        "SOURCE sprints and slams into TARGET, dealing DAMAGE",
        "SOURCE leaps into the air and lands on TARGET with their shield, dealing DAMAGE",
      ],
    },
  ],
} satisfies ActionData;

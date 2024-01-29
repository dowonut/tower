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
        "PLAYER sprints and slams into ENEMY, dealing DAMAGE",
        "PLAYER leaps into the air and lands on ENEMY with their shield, dealing DAMAGE",
      ],
    },
  ],
} satisfies ActionData;

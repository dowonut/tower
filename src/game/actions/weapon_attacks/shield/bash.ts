export default {
  name: "bash",
  requiredWeapon: ["shield"],
  description: "Bash the enemy with your shield.",
  type: "weapon_attack",
  outcomes: [
    {
      type: "damage",
      damage: { type: "bludgeoning", source: "ATK", basePercent: 50 },
      messages: ["SOURCE bashes TARGET with their shield, dealing DAMAGE"],
    },
  ],
} as const satisfies ActionData;

export default {
  name: "bash",
  requiredWeapon: ["shield"],
  description: "Bash the enemy with your shield.",
  type: "weapon_attack",
  outcomes: [
    {
      type: "damage",
      damage: { type: "bludgeoning", scalingStat: "ATK", basePercent: 50, scaling: "percent" },
      messages: ["SOURCE bashes TARGET with their shield, dealing DAMAGE"],
    },
  ],
} as const satisfies ActionData;

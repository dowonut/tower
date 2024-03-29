export default {
  name: "bonk",
  type: "weapon_attack",
  requiredWeapon: ["staff"],
  description: "Bonk an enemy with your staff.",
  outcomes: [
    {
      type: "damage",
      damage: { type: "bludgeoning", scalingStat: "ATK", basePercent: 50, scaling: "percent" },
      messages: ["SOURCE bonks TARGET on the head with their staff and deals DAMAGE"],
    },
  ],
} as const satisfies ActionData;

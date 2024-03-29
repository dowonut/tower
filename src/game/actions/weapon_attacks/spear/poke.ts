export default {
  name: "poke",
  requiredWeapon: ["spear"],
  description: "Poke the enemy gently with your spear.",
  type: "weapon_attack",
  outcomes: [
    {
      damage: [{ type: "piercing", scalingStat: "ATK", basePercent: 50, scaling: "percent" }],
      messages: [
        "SOURCE pokes TARGET with the pointy end of their spear, dealing a massive DAMAGE",
        "TARGET receives a thorough poking by SOURCE, taking DAMAGE",
      ],
      type: "damage",
    },
  ],
} as const satisfies ActionData;

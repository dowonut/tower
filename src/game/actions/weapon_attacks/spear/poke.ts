export default {
  name: "poke",
  requiredWeapon: ["spear"],
  description: "Poke the enemy gently with your spear.",
  type: "weapon_attack",
  outcomes: [
    {
      damage: [{ type: "piercing", source: "ATK", basePercent: 50 }],
      messages: [
        "SOURCE pokes TARGET with the pointy end of their spear, dealing a massive DAMAGE",
        "TARGET receives a thorough poking by SOURCE, taking DAMAGE",
      ],
      type: "damage",
    },
  ],
} satisfies ActionData;

export default {
  name: "poke",
  requiredWeapon: ["spear"],
  description: "Poke the enemy gently with your spear.",
  type: "weapon_attack",
  effects: [
    {
      damage: [{ type: "piercing", source: "ATK", basePercent: 50 }],
      messages: [
        "PLAYER pokes ENEMY with the pointy end of their spear, dealing a massive DAMAGE",
        "ENEMY receives a thorough poking by PLAYER, taking DAMAGE",
      ],
      type: "damage",
    },
  ],
} satisfies ActionData;

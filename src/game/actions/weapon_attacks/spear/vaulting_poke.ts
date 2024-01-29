export default {
  name: "vaulting poke",
  requiredWeapon: ["spear"],
  description: "Jump into the air and poke the enemy with your spear.",
  type: "weapon_attack",
  cooldown: 2,
  effects: [
    {
      type: "damage",
      damage: [{ type: "piercing", source: "ATK", basePercent: 70 }],
      messages: [
        "PLAYER runs and jumps into the air, poking ENEMY with their spear and dealing DAMAGE",
      ],
    },
  ],
} satisfies ActionData;

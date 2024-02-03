export default {
  name: "vaulting poke",
  requiredWeapon: ["spear"],
  description: "Jump into the air and poke the enemy with your spear.",
  type: "weapon_attack",
  cooldown: 1,
  outcomes: [
    {
      type: "damage",
      damage: [{ type: "piercing", source: "ATK", basePercent: 70 }],
      messages: [
        "SOURCE runs and jumps into the air, poking TARGET with their spear and dealing DAMAGE",
      ],
    },
  ],
} satisfies ActionData;

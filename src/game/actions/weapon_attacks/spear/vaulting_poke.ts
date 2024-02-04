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
    {
      type: "apply_status",
      messages: ["SOURCE's damage causes TARGET to bleed, inflicting them with STATUS"],
      status: {
        name: "bleeding",
      },
      targetNumber: 2,
    },
  ],
} as const satisfies ActionData;

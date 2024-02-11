export default {
  name: "vaulting poke",
  requiredWeapon: ["spear"],
  description: "Jump into the air and poke the enemy with your spear.",
  type: "weapon_attack",
  cooldown: 1,
  outcomes: [
    {
      type: "damage",
      damage: [{ type: "piercing", scalingStat: "ATK", basePercent: 70, scaling: "percent" }],
      messages: [
        "SOURCE runs and jumps into the air, poking TARGET with their spear and dealing DAMAGE",
      ],
    },
    {
      type: "apply_status",
      messages: ["SOURCE's poke causes TARGET to bleed, inflicting them with STATUS"],
      status: {
        name: "bleeding",
      },
    },
  ],
} as const satisfies ActionData;

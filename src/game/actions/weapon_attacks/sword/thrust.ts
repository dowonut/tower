export default {
  name: "thrust",
  requiredWeapon: ["sword"],
  description: "A powerful thrust with your sword.",
  cooldown: 1,
  type: "weapon_attack",
  outcomes: [
    {
      type: "damage",
      damage: [{ type: "piercing", scalingStat: "ATK", basePercent: 35, scaling: "percent" }],
      messages: ["SOURCE's blade pierces through TARGET and deals DAMAGE"],
    },
    {
      type: "damage",
      targetNumber: 2,
      damage: [{ type: "piercing", scalingStat: "ATK", basePercent: 15, scaling: "percent" }],
      messages: ["SOURCE manages to slice TARGET, dealing DAMAGE"],
    },
    {
      type: "damage",
      targetNumber: 3,
      damage: [{ type: "piercing", scalingStat: "ATK", basePercent: 10, scaling: "percent" }],
      messages: ["SOURCE squeezes out a final tiny thrust towards TARGET, dealing DAMAGE"],
    },
    {
      type: "apply_status",
      messages: ["SOURCE's thrust causes TARGET to bleed, inflicting them with STATUS"],
      status: {
        name: "bleeding",
      },
    },
  ],
} as const satisfies ActionData;

export default {
  name: "cleave",
  type: "weapon_attack",
  requiredWeapon: ["axe"],
  description: "Swing your axe in a powerful move to hit all enemies.",
  cooldown: 1,
  outcomes: [
    {
      type: "damage",
      damage: {
        type: "slashing",
        scalingStat: "ATK",
        basePercent: 30,
        scaling: "percent",
      },
      messages: ["SOURCE hits TARGET with a powerful cleave, dealing DAMAGE"],
    },
    {
      type: "apply_status",
      status: {
        name: "dazed",
      },
      messages: ["SOURCE's cleave confuses TARGET, inflicting them with STATUS"],
    },
    {
      type: "damage",
      targetType: "all",
      damage: {
        type: "slashing",
        scalingStat: "ATK",
        basePercent: 10,
        scaling: "percent",
      },
      messages: ["SOURCE's swing also hits TARGET and deals DAMAGE"],
    },
  ],
} as const satisfies ActionData;

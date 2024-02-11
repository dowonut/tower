export default {
  name: "lunge",
  type: "weapon_attack",
  requiredWeapon: ["halberd"],
  description: "Lunge towards your enemies and hit them with your halberd.",
  cooldown: 1,
  outcomes: [
    {
      type: "damage",
      targetType: "single",
      damage: {
        type: "slashing",
        scalingStat: "ATK",
        basePercent: 50,
        scaling: "percent",
      },
      messages: ["SOURCE lunges at TARGET with their halberd, dealing DAMAGE"],
    },
    {
      type: "damage",
      targetType: "single",
      targetNumber: 2,
      damage: {
        type: "slashing",
        scalingStat: "ATK",
        basePercent: 15,
        scaling: "percent",
      },
      messages: ["SOURCE swiftly makes an extra swing at TARGET, dealing DAMAGE"],
    },
    {
      type: "apply_status",
      status: {
        name: "weakened",
      },
      messages: ["SOURCE's attack weakens TARGET, inflicting STATUS"],
      targetNumber: 1,
    },
    {
      type: "apply_status",
      status: {
        name: "weakened",
      },
      messages: ["SOURCE's attack also weakens TARGET, inflicting STATUS"],
      targetNumber: 2,
    },
  ],
} as const satisfies ActionData;

export default {
  name: "sweep",
  type: "weapon_attack",
  requiredWeapon: ["halberd"],
  description: "Make a sweeping attack towards your enemies.",
  outcomes: [
    {
      type: "damage",
      targetType: "all",
      damage: {
        type: "slashing",
        scalingStat: "ATK",
        basePercent: 10,
        scaling: "percent",
      },
      messages: ["SOURCE sweeps at TARGET with their halberd, dealing DAMAGE"],
    },
  ],
} as const satisfies ActionData;

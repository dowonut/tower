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
        source: "ATK",
        basePercent: 10,
      },
      messages: ["SOURCE sweeps at TARGET with their halberd, dealing DAMAGE"],
    },
  ],
} satisfies ActionData;

export default {
  name: "shoot",
  requiredWeapon: ["bow"],
  description: "Shoot your target with an arrow.",
  type: "weapon_attack",
  outcomes: [
    {
      type: "damage",
      damage: { type: "piercing", scalingStat: "ATK", basePercent: 50, scaling: "percent" },
      messages: [
        "SOURCE shoots a piercing arrow at TARGET, dealing DAMAGE",
        "SOURCE makes a beautiful shot at TARGET and deals DAMAGE",
      ],
    },
  ],
} as const satisfies ActionData;

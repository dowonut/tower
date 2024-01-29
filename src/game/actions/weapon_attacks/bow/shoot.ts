export default {
  name: "shoot",
  requiredWeapon: ["bow"],
  description: "Shoot your target with an arrow.",
  type: "weapon_attack",
  effects: [
    {
      type: "damage",
      damage: { type: "piercing", source: "ATK", basePercent: 50 },
      messages: [
        "SOURCE shoots a piercing arrow at TARGET, dealing DAMAGE",
        "SOURCE makes a beautiful shot at TARGET and deals DAMAGE",
      ],
    },
  ],
} satisfies ActionData;

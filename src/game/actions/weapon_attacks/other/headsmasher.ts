export default {
  // Name of attack (lowercase)
  name: "headsmasher",
  // Type of attack (unarmed, sword, etc)
  requiredWeapon: ["hammer"],
  // Attack description shown in attack command
  description: "Brutally smash a rock against your enemy's head.",
  type: "weapon_attack",
  outcomes: [
    {
      type: "damage",
      damage: { type: "bludgeoning", scalingStat: "ATK", basePercent: 200, scaling: "percent" },
      messages: [
        "Rock in hand, you brutally smash it against TARGET, dealing DAMAGE",
        "You channel the energy of your caveman ancestors, brutally crushing the rock against TARGET and dealing DAMAGE",
        "TARGET is completely annihilated by the rock and takes DAMAGE",
      ],
    },
  ],
} as const satisfies ActionData;

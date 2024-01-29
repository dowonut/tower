export default {
  // Name of attack (lowercase)
  name: "headsmasher",
  // Type of attack (unarmed, sword, etc)
  requiredWeapon: ["hammer"],
  // Attack description shown in attack command
  description: "Brutally smash a rock against your enemy's head.",
  type: "weapon_attack",
  effects: [
    {
      type: "damage",
      damage: { type: "bludgeoning", source: "ATK", basePercent: 200 },
      messages: [
        "Rock in hand, you brutally smash it against ENEMY, dealing DAMAGE",
        "You channel the energy of your caveman ancestors, brutally crushing the rock against ENEMY and dealing DAMAGE",
        "ENEMY is completely annihilated by the rock and takes DAMAGE",
      ],
    },
  ],
} satisfies ActionData;

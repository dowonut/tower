export default {
  // Name of attack (lowercase)
  name: "slash",
  // Type of attack (unarmed, sword, etc)
  requiredWeapon: ["sword"],
  // Attack description shown in attack command
  description: "A simple swing of your sword.",
  type: "weapon_attack",
  effects: [
    {
      type: "damage",
      damage: [{ type: "slashing", source: "ATK", basePercent: 50 }],
      messages: [
        "PLAYER slashes elegantly at ENEMY and deals DAMAGE",
        "PLAYER's sword cuts cleanly through ENEMY, dealing DAMAGE",
        "PLAYER gracefully slices at ENEMY with their blade, dealing DAMAGE",
      ],
    },
  ],
} satisfies ActionData;

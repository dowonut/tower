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
        "SOURCE slashes elegantly at TARGET and deals DAMAGE",
        "SOURCE's sword cuts cleanly through TARGET, dealing DAMAGE",
        "SOURCE gracefully slices at TARGET with their blade, dealing DAMAGE",
      ],
    },
  ],
} satisfies ActionData;

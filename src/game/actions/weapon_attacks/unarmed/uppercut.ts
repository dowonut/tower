export default {
  // Name of attack (lowercase)
  name: "uppercut",
  // Type of attack (unarmed, sword, etc)
  requiredWeapon: ["unarmed"],
  // Attack description shown in attack command
  description: "An upwards swing of your fist.",
  type: "weapon_attack",
  cooldown: 1,
  outcomes: [
    {
      type: "damage",
      damage: [{ type: "bludgeoning", scalingStat: "ATK", basePercent: 50 }],
      messages: ["SOURCE's fist connects with the underside of TARGET and deals DAMAGE"],
    },
  ],
} as const satisfies ActionData;

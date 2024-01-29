export default {
  // Name of attack (lowercase)
  name: "uppercut",
  // Type of attack (unarmed, sword, etc)
  requiredWeapon: ["unarmed"],
  // Attack description shown in attack command
  description: "An upwards swing of your fist.",
  type: "weapon_attack",
  cooldown: 2,
  effects: [
    {
      type: "damage",
      damage: [{ type: "bludgeoning", source: "ATK", basePercent: 50 }],
      messages: ["PLAYER's fist connects with the underside of ENEMY and deals DAMAGE"],
    },
  ],
} satisfies ActionData;

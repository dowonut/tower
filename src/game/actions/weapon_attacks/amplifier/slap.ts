export default {
  name: "slap",
  type: "weapon_attack",
  requiredWeapon: ["amplifier"],
  description: "Slap the enemy with your amplifier, dealing... damage?",
  effects: [
    {
      type: "damage",
      damage: {
        type: "bludgeoning",
        source: "ATK",
        basePercent: 10,
      },
      messages: [
        "SOURCE walks up and slaps ENEMY on the head with their amplifier, dealing DAMAGE",
      ],
    },
  ],
} satisfies ActionData;
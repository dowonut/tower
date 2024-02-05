export default {
  name: "slap",
  type: "weapon_attack",
  requiredWeapon: ["amplifier"],
  description: "Slap the enemy with your amplifier, dealing... damage?",
  outcomes: [
    {
      type: "damage",
      damage: [
        {
          type: "earth",
          scalingStat: "MAG",
          basePercent: 10,
        },
        {
          type: "fire",
          scalingStat: "MAG",
          basePercent: 10,
        },
        {
          type: "air",
          scalingStat: "MAG",
          basePercent: 10,
        },
        {
          type: "water",
          scalingStat: "MAG",
          basePercent: 10,
        },
      ],
      messages: [
        "SOURCE walks up and slaps TARGET on the head with their amplifier, dealing DAMAGE",
      ],
    },
  ],
} as const satisfies ActionData;

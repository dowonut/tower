export default {
  name: "slap",
  type: "weapon_attack",
  requiredWeapon: ["amplifier"],
  description: "Slap the enemy with your amplifier, dealing... damage?",
  effects: [
    {
      type: "damage",
      damage: [
        {
          type: "earth",
          source: "ATK",
          basePercent: 10,
        },
        {
          type: "fire",
          source: "ATK",
          basePercent: 10,
        },
        {
          type: "air",
          source: "ATK",
          basePercent: 10,
        },
        {
          type: "water",
          source: "ATK",
          basePercent: 10,
        },
      ],
      messages: [
        "SOURCE walks up and slaps TARGET on the head with their amplifier, dealing DAMAGE",
      ],
    },
  ],
} satisfies ActionData;

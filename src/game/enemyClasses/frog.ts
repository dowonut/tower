export default {
  // Name of class
  name: "frog",
  // Base XP dropped by class
  xp: {
    min: 80,
    max: 90,
  },
  // Class strengths and weaknesses
  strong: ["water"],
  weak: ["fire"],
  // All attacks available to the class
  attacks: [
    {
      // Attack name
      name: "lick",
      // All damage from attack. Can have several.
      damage: [
        {
          // Damage type
          type: "slashing",
          // Minimum damage
          min: 2,
          // Maximum damage
          max: 3,
          // Any damage modifiers will be evaluated.
          // LEVEL = enemy level
          modifier: "+LEVEL",
        },
      ],
      // Attack message to send in chat. Multiple strings will choose a random one.
      // You can input variables in the string:
      // ENEMY = enemy name
      // PLAYER = player name
      // DAMAGE = damage dealt
      messages: [
        "ENEMY extends a tongue of blades and licks PLAYER dealing DAMAGE",
      ],
    },
  ],
} satisfies EnemyType;

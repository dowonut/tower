export default {
  // Name of class
  name: "rock",
  // Base XP dropped by class
  xp: {
    min: 200,
    max: 300,
  },
  // Base strengths and weaknesses
  strong: [
    "bludgeoning",
    "piercing",
    "slashing",
    "earth",
    "fire",
    "air",
    "water",
  ],
  weak: [],
  // All attacks available to the class
  attacks: [
    {
      // Attack name
      name: "smash",
      damage: [
        {
          type: "bludgeoning",
          min: 1,
          max: 3,
          modifier: "+LEVEL",
        },
      ],
      // Attack message to send in chat
      messages: [
        "ENEMY somehow rises several meters above ground before violently smashing down on PLAYER, dealing DAMAGE",
      ],
      // Attack round cooldown
      cooldown: 0,
    },
  ],
};

export default {
  // Name of class
  name: "slime",
  // Base XP dropped by class
  xp: {
    min: 10,
    max: 20,
  },
  // Base strengths and weaknesses
  strong: ["bludgeoning"],
  weak: ["slashing"],
  // All attacks available to the class
  attacks: [
    {
      // Attack name
      name: "swallow",
      // All damage from attack, can have several
      damage: [
        {
          type: "bludgeoning",
          min: 1,
          max: 2,
          modifier: "+LEVEL",
        },
      ],
      // Attack message to send in chat
      messages: ["ENEMY tries to swallow PLAYER, dealing DAMAGE"],
      // Attack round cooldown
      cooldown: 1,
    },
    {
      name: "bounce",
      damage: [
        {
          type: "bludgeoning",
          min: 0,
          max: 1,
          modifier: "+LEVEL",
        },
      ],
      messages: ["ENEMY bounces on PLAYER, dealing DAMAGE"],
    },
    {
      name: "burn",
      damage: [
        {
          type: "bludgeoning",
          min: 1,
          max: 2,
          modifier: "+LEVEL",
        },
        {
          type: "fire",
          min: 1,
          max: 1,
        },
      ],
      messages: [
        "ENEMY jumps on PLAYER and covers them in flames, dealing DAMAGE",
      ],
    },
    {
      name: "drown",
      damage: [
        {
          type: "bludgeoning",
          min: 1,
          max: 2,
          modifier: "+LEVEL",
        },
        {
          type: "water",
          min: 1,
          max: 1,
        },
      ],
      messages: [
        "ENEMY tries to drown PLAYER by jumping on their head, dealing DAMAGE",
      ],
    },
  ],
};

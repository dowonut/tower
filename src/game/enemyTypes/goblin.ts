export default {
  // Name of class
  name: "goblin",
  // Base XP dropped by class
  xp: {
    min: 50,
    max: 60,
  },
  // Base strengths and weaknesses
  strong: ["earth"],
  weak: ["water"],
  // All attacks available to the class
  attacks: [
    {
      // Attack name
      name: "scratch",
      damage: [
        {
          type: "slashing",
          min: 1,
          max: 2,
          modifier: "+LEVEL",
        },
      ],
      // Attack message to send in chat
      messages: ["ENEMY viciously scratches PLAYER dealing DAMAGE"],
      // Attack round cooldown
      cooldown: 1,
    },
    {
      // Attack name
      name: "punch",
      damage: [
        {
          type: "bludgeoning",
          min: 0,
          max: 1,
          modifier: "+LEVEL",
        },
      ],
      // Attack message to send in chat
      messages: [
        "ENEMY runs behind PLAYER and punches them in the nuts, dealing DAMAGE",
      ],
      // Attack round cooldown
      cooldown: 0,
    },
    {
      // Attack name
      name: "club",
      damage: [
        {
          type: "bludgeoning",
          min: 2,
          max: 3,
          modifier: "+LEVEL",
        },
      ],
      // Attack message to send in chat
      messages: ["ENEMY swings a massive club into PLAYER, dealing DAMAGE"],
      // Attack round cooldown
      cooldown: 0,
    },
  ],
} as EnemyType;

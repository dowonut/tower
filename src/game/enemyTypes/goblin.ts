export default {
  // Name of class
  name: "goblin",
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
          source: "ATK",
          basePercent: 70,
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
          source: "ATK",
          basePercent: 50,
        },
      ],
      // Attack message to send in chat
      messages: ["ENEMY runs behind PLAYER and strikes them in the back, dealing DAMAGE"],
      // Attack round cooldown
      cooldown: 0,
    },
    {
      // Attack name
      name: "club",
      damage: [
        {
          type: "bludgeoning",
          source: "ATK",
          basePercent: 80,
        },
      ],
      // Attack message to send in chat
      messages: ["ENEMY swings a massive club into PLAYER, dealing DAMAGE"],
      // Attack round cooldown
      cooldown: 0,
    },
  ],
} satisfies EnemyType;

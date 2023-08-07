export default {
  // Name of class
  name: "rock",
  // Base strengths and weaknesses
  strong: ["bludgeoning", "piercing", "slashing", "earth", "fire", "air", "water"],
  weak: [],
  // All attacks available to the class
  attacks: [
    {
      // Attack name
      name: "smash",
      damage: [
        {
          type: "bludgeoning",
          source: "ATK",
          basePercent: 80,
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
} satisfies EnemyType;

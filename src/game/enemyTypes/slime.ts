export default {
  // Name of class
  name: "slime",
  // Base strengths and weaknesses
  strong: ["bludgeoning"],
  weak: ["slashing"],
  // All attacks available to the class
  attacks: [
    {
      name: "swallow",
      damage: [
        {
          type: "bludgeoning",
          source: "ATK",
          basePercent: 80,
        },
      ],
      messages: ["ENEMY tries to swallow PLAYER, dealing DAMAGE"],
      cooldown: 1,
    },
    {
      name: "bounce",
      damage: [
        {
          type: "bludgeoning",
          source: "ATK",
          basePercent: 50,
        },
      ],
      messages: ["ENEMY bounces on PLAYER, dealing DAMAGE"],
    },
    {
      name: "burn",
      damage: [
        {
          type: "bludgeoning",
          source: "ATK",
          basePercent: 50,
        },
        {
          type: "fire",
          source: "ATK",
          basePercent: 50,
        },
      ],
      messages: ["ENEMY jumps on PLAYER and covers them in flames, dealing DAMAGE"],
    },
    {
      name: "drown",
      damage: [
        {
          type: "bludgeoning",
          source: "ATK",
          basePercent: 50,
        },
        {
          type: "water",
          source: "ATK",
          basePercent: 50,
        },
      ],
      messages: ["ENEMY tries to drown PLAYER by jumping on their head, dealing DAMAGE"],
    },
  ],
} satisfies EnemyType;

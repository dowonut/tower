export default {
  // Name of class
  name: "rock",
  // Base strengths and weaknesses
  strong: ["bludgeoning", "piercing", "slashing", "earth", "fire", "air", "water"],
  weak: [],
  // All attacks available to the class
  actions: [
    {
      name: "smash",
      cooldown: 0,
      type: "ability",
      outcomes: [
        {
          type: "damage",
          targetType: "all",
          damage: [
            {
              type: "bludgeoning",
              scalingStat: "ATK",
              basePercent: 80,
            },
          ],
          messages: [
            "SOURCE somehow rises several meters above ground before violently smashing down on TARGET, dealing DAMAGE",
          ],
        },
      ],
    },
  ],
} as const satisfies EnemyType;

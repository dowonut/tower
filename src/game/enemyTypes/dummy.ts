export default {
  // Name of class
  name: "dummy",
  // Base strengths and weaknesses
  strong: [],
  weak: [],
  // All attacks available to the class
  actions: [
    {
      name: "stare",
      cooldown: 0,
      type: "ability",
      outcomes: [
        {
          type: "damage",
          targetType: "single",
          damage: [
            {
              type: "bludgeoning",
              scalingStat: "ATK",
              basePercent: 0,
            },
          ],
          messages: ["SOURCE does nothing."],
        },
      ],
    },
  ],
} as const satisfies EnemyType;

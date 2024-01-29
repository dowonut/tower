export default {
  // Name of class
  name: "slime",
  // Base strengths and weaknesses
  strong: ["bludgeoning"],
  weak: ["slashing"],
  // All attacks available to the class
  actions: [
    {
      name: "swallow",
      type: "ability",
      cooldown: 1,
      effects: [
        {
          type: "damage",
          targetType: "single",
          damage: {
            type: "bludgeoning",
            source: "ATK",
            basePercent: 60,
          },
          messages: ["SOURCE tries to swallow TARGET, dealing DAMAGE"],
        },
      ],
    },
    {
      name: "bounce",
      type: "ability",
      effects: [
        {
          type: "damage",
          targetType: "single",
          damage: {
            type: "bludgeoning",
            source: "ATK",
            basePercent: 30,
          },
          messages: ["SOURCE bounces on TARGET, dealing DAMAGE"],
        },
      ],
    },
    {
      name: "burn",
      type: "ability",
      cooldown: 1,
      effects: [
        {
          type: "damage",
          targetType: "single",
          damage: [
            {
              type: "bludgeoning",
              source: "ATK",
              basePercent: 30,
            },
            {
              type: "fire",
              source: "MAG",
              basePercent: 30,
            },
          ],
          messages: ["TARGET jumps on SOURCE and covers them in flames, dealing DAMAGE"],
        },
      ],
    },
    {
      name: "drown",
      type: "ability",
      cooldown: 1,
      effects: [
        {
          type: "damage",
          targetType: "single",
          damage: [
            {
              type: "bludgeoning",
              source: "ATK",
              basePercent: 30,
            },
            {
              type: "water",
              source: "ATK",
              basePercent: 30,
            },
          ],
          messages: ["SOURCE tries to drown TARGET by jumping on their head, dealing DAMAGE"],
        },
      ],
    },
  ],
} satisfies EnemyType;

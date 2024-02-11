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
      outcomes: [
        {
          type: "damage",
          targetType: "single",
          damage: {
            type: "bludgeoning",
            scalingStat: "ATK",
            basePercent: 50,
            scaling: "percent",
          },
          messages: ["SOURCE tries to swallow TARGET, dealing DAMAGE"],
        },
      ],
    },
    {
      name: "bounce",
      type: "ability",
      outcomes: [
        {
          type: "damage",
          targetType: "single",
          damage: {
            type: "bludgeoning",
            scalingStat: "ATK",
            basePercent: 30,
            scaling: "percent",
          },
          messages: ["SOURCE bounces on TARGET, dealing DAMAGE"],
        },
      ],
    },
    {
      name: "burn",
      type: "ability",
      cooldown: 1,
      outcomes: [
        {
          type: "damage",
          targetType: "single",
          damage: [
            {
              type: "bludgeoning",
              scalingStat: "ATK",
              basePercent: 30,
              scaling: "percent",
            },
            {
              type: "fire",
              scalingStat: "MAG",
              basePercent: 30,
              scaling: "percent",
            },
          ],
          messages: ["SOURCE jumps on TARGET and covers them in flames, dealing DAMAGE"],
        },
        {
          type: "apply_status",
          status: {
            name: "burning",
          },
          messages: ["SOURCE's flames spread across TARGET, inflicting STATUS"],
        },
      ],
    },
    {
      name: "drown",
      type: "ability",
      cooldown: 1,
      outcomes: [
        {
          type: "damage",
          targetType: "single",
          damage: [
            {
              type: "bludgeoning",
              scalingStat: "ATK",
              basePercent: 30,
              scaling: "percent",
            },
            {
              type: "water",
              scalingStat: "ATK",
              basePercent: 30,
              scaling: "percent",
            },
          ],
          messages: ["SOURCE tries to drown TARGET by jumping on their head, dealing DAMAGE"],
        },
        {
          type: "apply_status",
          status: {
            name: "wet",
          },
          messages: ["SOURCE's attack leaves TARGET soaked, inflicting STATUS"],
        },
      ],
    },
  ],
} as const satisfies EnemyType;

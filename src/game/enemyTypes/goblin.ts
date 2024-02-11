export default {
  // Name of class
  name: "goblin",
  // Base strengths and weaknesses
  strong: ["earth"],
  weak: ["water"],
  // All attacks available to the class
  actions: [
    {
      name: "scratch",
      cooldown: 1,
      type: "ability",
      outcomes: [
        {
          type: "damage",
          damage: [
            {
              type: "slashing",
              scalingStat: "ATK",
              basePercent: 60,
              scaling: "percent",
            },
          ],
          messages: ["SOURCE viciously scratches TARGET dealing DAMAGE"],
        },
      ],
    },
    {
      name: "punch",
      type: "ability",
      outcomes: [
        {
          type: "damage",
          damage: [
            {
              type: "bludgeoning",
              scalingStat: "ATK",
              basePercent: 50,
              scaling: "percent",
            },
          ],
          messages: ["SOURCE runs behind TARGET and strikes them in the back, dealing DAMAGE"],
        },
      ],
    },
    {
      name: "club",
      type: "ability",
      cooldown: 1,
      outcomes: [
        {
          type: "damage",
          damage: [
            {
              type: "bludgeoning",
              scalingStat: "ATK",
              basePercent: 70,
              scaling: "percent",
            },
          ],
          messages: ["SOURCE swings a massive club into TARGET, dealing DAMAGE"],
        },
      ],
    },
  ],
} as const satisfies EnemyType;

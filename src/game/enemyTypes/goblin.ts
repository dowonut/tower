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
      effects: [
        {
          type: "damage",
          damage: [
            {
              type: "slashing",
              source: "ATK",
              basePercent: 60,
            },
          ],
          messages: ["SOURCE viciously scratches TARGET dealing DAMAGE"],
        },
      ],
    },
    {
      name: "punch",
      type: "ability",
      effects: [
        {
          type: "damage",
          damage: [
            {
              type: "bludgeoning",
              source: "ATK",
              basePercent: 50,
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
      effects: [
        {
          type: "damage",
          damage: [
            {
              type: "bludgeoning",
              source: "ATK",
              basePercent: 70,
            },
          ],
          messages: ["SOURCE swings a massive club into TARGET, dealing DAMAGE"],
        },
      ],
    },
  ],
} satisfies EnemyType;

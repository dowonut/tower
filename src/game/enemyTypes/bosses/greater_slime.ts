export default {
  name: "greater slime",
  strong: [],
  weak: [],
  loot: [{ name: "slimeball", dropChance: 100, min: 5, max: 10 }],
  actions: [
    {
      name: "spit slime",
      type: "ability",
      outcomes: [
        {
          type: "damage",
          damage: { type: "piercing", scalingStat: "ATK", basePercent: 50 },
          messages: ["SOURCE spits a ball of slime at TARGET dealing DAMAGE"],
        },
      ],
    },
  ],
} as const satisfies EnemyType;

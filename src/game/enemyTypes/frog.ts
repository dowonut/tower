export default {
  name: "frog",
  strong: ["water"],
  weak: ["fire"],
  actions: [
    {
      name: "lick",
      type: "ability",
      effects: [
        {
          type: "damage",
          damage: [
            {
              type: "slashing",
              source: "ATK",
              basePercent: 50,
            },
          ],
          messages: ["SOURCE extends a tongue of blades and licks TARGET, dealing DAMAGE"],
        },
      ],
    },
    {
      name: "milky splash",
      type: "ability",
      cooldown: 1,
      effects: [
        {
          type: "damage",
          targetType: "all",
          damage: {
            type: "water",
            source: "MAG",
            basePercent: 20,
          },
          messages: ["SOURCE opens their mouth and splashes milk all over TARGET, dealing DAMAGE"],
        },
      ],
    },
    {
      name: "malicious lick",
      type: "ability",
      cooldown: 1,
      effects: [
        {
          type: "damage",
          damage: {
            type: "piercing",
            source: "ATK",
            basePercent: 50,
          },
          messages: ["SOURCE emits an evil aura and licks TARGET, dealing DAMAGE"],
        },
        {
          type: "damage",
          targetType: "all",
          damage: {
            type: "void",
            source: "MAG",
            basePercent: 10,
          },
          messages: [
            "The evil aura emitted by SOURCE creeps into TARGET, dealing an additional DAMAGE",
          ],
        },
      ],
    },
  ],
} satisfies EnemyType;

export default {
  name: "frog",
  strong: ["water"],
  weak: ["fire"],
  actions: [
    {
      name: "lick",
      type: "ability",
      outcomes: [
        {
          type: "damage",
          damage: [
            {
              type: "slashing",
              scalingStat: "ATK",
              basePercent: 50,
            },
          ],
          messages: ["SOURCE extends a tongue of blades and licks TARGET, dealing DAMAGE"],
        },
        {
          type: "apply_status",
          messages: ["SOURCE causes TARGET to bleed, inflicting STATUS"],
          status: {
            name: "bleeding",
          },
        },
      ],
    },
    {
      name: "milky splash",
      type: "ability",
      cooldown: 1,
      outcomes: [
        {
          type: "damage",
          targetType: "all",
          damage: {
            type: "water",
            scalingStat: "MAG",
            basePercent: 30,
          },
          messages: ["SOURCE opens their mouth and splashes milk all over TARGET, dealing DAMAGE"],
        },
      ],
    },
    {
      name: "malicious lick",
      type: "ability",
      cooldown: 1,
      outcomes: [
        {
          type: "damage",
          damage: {
            type: "piercing",
            scalingStat: "ATK",
            basePercent: 50,
          },
          messages: ["SOURCE emits an evil aura and licks TARGET, dealing DAMAGE"],
        },
        {
          type: "damage",
          targetType: "all",
          damage: {
            type: "void",
            scalingStat: "MAG",
            basePercent: 10,
          },
          messages: [
            "The evil aura emitted by SOURCE creeps into TARGET, dealing an additional DAMAGE",
          ],
        },
      ],
    },
  ],
} as const satisfies EnemyType;

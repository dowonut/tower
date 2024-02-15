export default {
  name: "frog",
  strong: ["water"],
  weak: ["fire"],
  actions: [
    //* Lick ability
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
              basePercent: 20,
              scaling: "percent",
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
    //* Milky splash ability
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
            scaling: "percent",
          },
          messages: ["SOURCE opens their mouth and splashes milk all over TARGET, dealing DAMAGE"],
        },
      ],
    },
    //* Malicious lick ability
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
            scaling: "percent",
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
            scaling: "percent",
          },
          messages: [
            "The evil aura emitted by SOURCE creeps into TARGET, dealing an additional DAMAGE",
          ],
        },
        {
          type: "apply_status",
          status: {
            name: "weakened",
          },
          targetType: "all",
          messages: ["TARGET is very afraid of SOURCE, inflicting them with STATUS"],
        },
      ],
    },
  ],
} as const satisfies EnemyType;

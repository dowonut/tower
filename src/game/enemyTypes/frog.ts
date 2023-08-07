export default {
  name: "frog",
  strong: ["water"],
  weak: ["fire"],
  attacks: [
    {
      name: "lick",
      damage: [
        {
          // Damage type
          type: "slashing",
          source: "ATK",
          basePercent: 50,
        },
      ],
      messages: ["ENEMY extends a tongue of blades and licks PLAYER dealing DAMAGE"],
    },
  ],
} satisfies EnemyType;

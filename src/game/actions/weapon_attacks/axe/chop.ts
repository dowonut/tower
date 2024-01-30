export default {
  name: "chop",
  type: "weapon_attack",
  requiredWeapon: ["axe"],
  description: "Chop the enemy down with your axe.",
  effects: [
    {
      type: "damage",
      damage: {
        type: "slashing",
        source: "ATK",
        basePercent: 50,
      },
      messages: [
        "SOURCE uses their axe to chop TARGET, dealing DAMAGE",
        "TARGET is chopped down by SOURCE's axe and takes DAMAGE",
      ],
    },
  ],
} satisfies ActionData;
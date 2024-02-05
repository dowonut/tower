export default {
  name: "chop",
  type: "weapon_attack",
  requiredWeapon: ["axe"],
  description: "Chop the enemy down with your axe.",
  outcomes: [
    {
      type: "damage",
      damage: {
        type: "slashing",
        scalingStat: "ATK",
        basePercent: 50,
      },
      messages: [
        "SOURCE uses their axe to chop TARGET, dealing DAMAGE",
        "TARGET is chopped down by SOURCE's axe and takes DAMAGE",
      ],
    },
  ],
} as const satisfies ActionData;

export default {
  name: "punch",
  requiredWeapon: ["unarmed"],
  description: "A simple punch using your fist.",
  type: "weapon_attack",
  outcomes: [
    {
      type: "damage",
      damage: [{ type: "bludgeoning", scalingStat: "ATK", basePercent: 30, scaling: "percent" }],
      messages: [
        "SOURCE lands a solid punch on TARGET and deals DAMAGE",
        "SOURCE's fist meets with TARGET and deals DAMAGE",
        "TARGET doesn't see SOURCE's fist coming and takes DAMAGE",
        "TARGET is struck hard by SOURCE's iron fist and takes DAMAGE",
      ],
    },
  ],
} as const satisfies ActionData;

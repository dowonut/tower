export default {
  name: "punch",
  requiredWeapon: ["unarmed"],
  description: "A simple punch using your fist.",
  type: "weapon_attack",
  effects: [
    {
      type: "damage",
      damage: [{ type: "bludgeoning", source: "ATK", basePercent: 30 }],
      messages: [
        "PLAYER lands a solid punch on ENEMY and deals DAMAGE",
        "PLAYER's fist meets with ENEMY and deals DAMAGE",
        "ENEMY didn't see PLAYER's fist coming and takes DAMAGE",
        "ENEMY is struck hard by PLAYER's iron fist and takes DAMAGE",
      ],
    },
  ],
} satisfies ActionData;

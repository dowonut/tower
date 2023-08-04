export default {
  name: "punch",
  weaponType: ["unarmed"],
  description: "A simple punch using your fist.",
  damage: [{ type: "bludgeoning", source: "ATK", basePercent: 20 }],
  messages: [
    "PLAYER lands a solid punch on ENEMY and deal DAMAGE",
    "PLAYER's fist meets with ENEMY and deals DAMAGE",
    "ENEMY didn't see PLAYER's fist coming and takes DAMAGE",
    "ENEMY is struck hard by PLAYER's iron fist and takes DAMAGE",
  ],
} satisfies AttackData;

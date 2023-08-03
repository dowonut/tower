export default {
  name: "punch",
  weaponType: ["unarmed"],
  description: "A simple punch using your fist.",
  damage: [{ type: "bludgeoning", source: "ATK", basePercent: 50 }],
  messages: [
    "You land a solid punch on ENEMY and deal DAMAGE",
    "Your fist meets with ENEMY and deals DAMAGE",
    "ENEMY didn't see your fist coming and takes DAMAGE",
    "ENEMY is struck hard by your iron fist and takes DAMAGE",
  ],
} satisfies AttackData;

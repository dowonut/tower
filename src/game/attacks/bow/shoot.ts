export default {
  name: "shoot",
  weaponType: ["bow"],
  description: "Shoot your target with an arrow.",
  damage: [{ type: "piercing", source: "ATK", basePercent: 50 }],
  messages: [
    "PLAYER shoots a piercing arrow at ENEMY, dealing DAMAGE",
    "PLAYER makes a beautiful shot at ENEMY and deals DAMAGE",
  ],
} satisfies AttackData;

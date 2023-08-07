export default {
  name: "thrust",
  weaponType: ["sword"],
  description: "A powerful thrust with your sword.",
  damage: [{ type: "piercing", source: "ATK", basePercent: 70 }],
  cooldown: 2,
  messages: ["Your blade pierces through ENEMY and deals DAMAGE"],
} satisfies AttackData;

export default {
  name: "big smash",
  description: "Do a big smash with your hammer.",
  weaponType: ["hammer"],
  cooldown: 2,
  damage: [
    { type: "bludgeoning", source: "ATK", basePercent: 50, targetType: "single" },
    { type: "bludgeoning", source: "ATK", basePercent: 20, targetType: "adjacent" },
  ],
  messages: [
    { targetType: "single", list: ["PLAYER runs up and smashes ENEMY with their big fat hammer, dealing DAMAGE"] },
    { targetType: "adjacent", list: ["PLAYER's smash causes a shockwave, dealing DAMAGE to ENEMY"] },
  ],
} satisfies AttackData;

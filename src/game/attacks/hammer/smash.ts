export default {
  name: "big smash",
  description: "Do a big smash with your hammer.",
  weaponType: ["hammer"],
  damage: [
    { type: "bludgeoning", source: "ATK", basePercent: 50 },
    { type: "earth", source: "MAG", basePercent: 80 },
  ],
  messages: ["PLAYER smashes ENEMY with their big fat hammer, dealing DAMAGE"],
} satisfies AttackData;

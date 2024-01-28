export default {
  name: "vaulting poke",
  weaponType: ["spear"],
  description: "Jump into the air and poke the enemy with your spear.",
  damage: [{ type: "piercing", source: "ATK", basePercent: 70 }],
  cooldown: 2,
  messages: ["PLAYER runs and jumps into the air, poking ENEMY with their spear and dealing DAMAGE"],
} satisfies AttackData;

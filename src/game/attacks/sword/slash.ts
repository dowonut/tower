export default {
  // Name of attack (lowercase)
  name: "slash",
  // Type of attack (unarmed, sword, etc)
  weaponType: ["sword"],
  // Attack description shown in attack command
  description: "A simple swing of your sword.",
  // Attack damages
  damage: [{ type: "slashing", source: "ATK", basePercent: 50 }],
  // Attack message to send in chat. Multiple strings will choose a random one.
  // You can input variables in the string:
  // ENEMY = enemy name
  // DAMAGE = damage dealt
  messages: [
    "PLAYER slashes elegantly at ENEMY and deals DAMAGE",
    "PLAYER's sword cuts cleanly through ENEMY, dealing DAMAGE",
    "PLAYER gracefully slices at ENEMY with their blade, dealing DAMAGE",
  ],
} satisfies AttackData;

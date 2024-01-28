export default {
  // Name of attack (lowercase)
  name: "uppercut",
  // Type of attack (unarmed, sword, etc)
  weaponType: ["unarmed"],
  // Attack description shown in attack command
  description: "An upwards swing of your fist.",
  // Attack damages
  damage: [{ type: "bludgeoning", source: "ATK", basePercent: 50 }],
  cooldown: 2,
  // Attack message to send in chat. Multiple strings will choose a random one.
  // You can input variables in the string:
  // ENEMY = enemy name
  // DAMAGE = damage dealt
  messages: ["PLAYER's fist connects with the underside of ENEMY and deals DAMAGE"],
} satisfies AttackData;

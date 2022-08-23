export default {
  // Name of attack (lowercase)
  name: "thrust",
  // Type of attack (unarmed, sword, etc)
  type: ["sword"],
  // Attack description shown in attack command
  description: "A powerful thrust with your sword.",
  // Attack damages
  damage: [{ type: "piercing", min: 5, max: 6 }],
  cooldown: 2,
  // Attack message to send in chat. Multiple strings will choose a random one.
  // You can input variables in the string:
  // ENEMY = enemy name
  // DAMAGE = damage dealt
  messages: ["Your blade pierces through ENEMY and deals DAMAGE"],
};

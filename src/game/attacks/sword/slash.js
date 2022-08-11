export default {
  // Name of attack (lowercase)
  name: "slash",
  // Type of attack (unarmed, sword, etc)
  type: ["sword"],
  // Attack description shown in attack command
  description: "A simple swing of your sword.",
  // Attack damages
  damage: [{ type: "slashing", min: 3, max: 5 }],
  // Attack message to send in chat. Multiple strings will choose a random one.
  // You can input variables in the string:
  // ENEMY = enemy name
  // DAMAGE = damage dealt
  messages: [
    "You slash elegantly at ENEMY and deal DAMAGE",
    "Your sword cuts cleanly through ENEMY, dealing DAMAGE",
    "You gracefully slice at ENEMY with your blade, dealing DAMAGE",
  ],
};

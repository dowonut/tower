export default {
  // Name of attack (lowercase)
  name: "headsmasher",
  // Type of attack (unarmed, sword, etc)
  type: ["rock"],
  // Attack description shown in attack command
  description: "Brutally smash a rock against your enemy's head.",
  // Attack damages
  damage: [{ type: "bludgeoning", min: 3, max: 5 }],
  // Attack message to send in chat. Multiple strings will choose a random one.
  // You can input variables in the string:
  // ENEMY = enemy name
  // DAMAGE = damage dealt
  messages: [
    "Rock in hand, you brutally smash it against ENEMY, dealing DAMAGE",
    "You channel the energy of your caveman ancestors, brutally crushing the rock against ENEMY and dealing DAMAGE",
    "ENEMY is completely annihilated by the rock and takes DAMAGE",
  ],
};

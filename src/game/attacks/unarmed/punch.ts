export default {
  // Name of attack (lowercase)
  name: "punch",
  // Type of attack (unarmed, sword, etc)
  type: ["unarmed"],
  // Attack description shown in attack command
  description: "A simple punch using your fist.",
  // Attack damages
  damage: [{ type: "bludgeoning", min: 2, max: 3 }],
  // Attack message to send in chat. Multiple strings will choose a random one.
  // You can input variables in the string:
  // ENEMY = enemy name
  // DAMAGE = damage dealt
  messages: [
    "You land a solid punch on ENEMY and deal DAMAGE",
    "Your fist meets with ENEMY and deals DAMAGE",
    "ENEMY didn't see your fist coming and takes DAMAGE",
    "ENEMY is struck hard by your iron fist and takes DAMAGE",
  ],
} satisfies AttackData;

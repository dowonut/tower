export default {
  name: "spin whack",
  type: "weapon_attack",
  requiredWeapon: ["staff"],
  description: "Whack all enemies, hard, with your staff.",
  cooldown: 1,
  outcomes: [
    {
      type: "damage",
      targetType: "all",
      damage: { type: "bludgeoning", scalingStat: "ATK", basePercent: 20 },
      messages: ["SOURCE spins around and whacks TARGET with their staff, dealing DAMAGE"],
    },
  ],
} as const satisfies ActionData;

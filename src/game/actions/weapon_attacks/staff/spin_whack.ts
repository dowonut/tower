export default {
  name: "spin whack",
  type: "weapon_attack",
  requiredWeapon: ["staff"],
  description: "Whack all enemies, hard, with your staff.",
  cooldown: 1,
  effects: [
    {
      type: "damage",
      targetType: "all",
      damage: { type: "bludgeoning", source: "ATK", basePercent: 17 },
      messages: ["SOURCE spins around and whacks TARGET with their staff, dealings DAMAGE"],
    },
  ],
} satisfies ActionData;

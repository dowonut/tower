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
      damage: { type: "bludgeoning", scalingStat: "ATK", basePercent: 20, scaling: "percent" },
      messages: ["SOURCE spins around and whacks TARGET with their staff, dealing DAMAGE"],
    },
    {
      type: "apply_status",
      targetType: "self",
      status: {
        name: "invigorated",
      },
      messages: ["SOURCE's spin puts them in a good mood, inflicting them with STATUS"],
    },
  ],
} as const satisfies ActionData;

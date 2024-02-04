export default {
  name: "lunge",
  type: "weapon_attack",
  requiredWeapon: ["halberd"],
  description: "Lunge towards your enemies and hit them with your halberd.",
  cooldown: 1,
  outcomes: [
    {
      type: "damage",
      targetType: "single",
      damage: {
        type: "slashing",
        source: "ATK",
        basePercent: 50,
      },
      messages: ["SOURCE lunges at TARGET with their halberd, dealing DAMAGE"],
    },
    {
      type: "damage",
      targetType: "single",
      targetNumber: 2,
      damage: {
        type: "slashing",
        source: "ATK",
        basePercent: 15,
      },
      messages: ["SOURCE swiftly makes an extra swing at TARGET, dealing DAMAGE"],
    },
  ],
} as const satisfies ActionData;

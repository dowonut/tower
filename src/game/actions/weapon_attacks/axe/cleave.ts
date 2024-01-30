export default {
  name: "cleave",
  type: "weapon_attack",
  requiredWeapon: ["axe"],
  description: "Swing your axe in a powerful move to hit all enemies.",
  cooldown: 1,
  effects: [
    {
      type: "damage",
      damage: {
        type: "slashing",
        source: "ATK",
        basePercent: 30,
      },
      messages: ["SOURCE hits TARGET with a powerful cleave, dealing DAMAGE"],
    },
    {
      type: "damage",
      targetType: "all",
      damage: {
        type: "slashing",
        source: "ATK",
        basePercent: 10,
      },
      messages: ["SOURCE's swing also hits TARGET and deals DAMAGE"],
    },
  ],
} satisfies ActionData;

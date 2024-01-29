export default {
  name: "thrust",
  requiredWeapon: ["sword"],
  description: "A powerful thrust with your sword.",
  cooldown: 1,
  type: "weapon_attack",
  effects: [
    {
      type: "damage",
      damage: [{ type: "piercing", source: "ATK", basePercent: 70 }],
      messages: ["SOURCE's blade pierces through TARGET and deals DAMAGE"],
    },
  ],
} satisfies ActionData;

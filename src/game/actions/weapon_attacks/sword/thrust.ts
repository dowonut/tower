export default {
  name: "thrust",
  requiredWeapon: ["sword"],
  description: "A powerful thrust with your sword.",
  cooldown: 2,
  type: "weapon_attack",
  effects: [
    {
      type: "damage",
      damage: [{ type: "piercing", source: "ATK", basePercent: 70 }],
      messages: ["PLAYER's blade pierces through ENEMY and deals DAMAGE"],
    },
  ],
} satisfies ActionData;

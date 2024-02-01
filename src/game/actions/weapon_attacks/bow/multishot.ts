export default {
  name: "multishot",
  type: "weapon_attack",
  requiredWeapon: ["bow"],
  cooldown: 1,
  effects: [
    {
      type: "damage",
      targetType: "single",
      targetNumber: 1,
      damage: {
        type: "piercing",
        source: "ATK",
        basePercent: 20,
      },
      messages: ["SOURCE makes a fast shot at TARGET and deals DAMAGE"],
    },
    {
      type: "damage",
      targetType: "single",
      targetNumber: 2,
      damage: {
        type: "piercing",
        source: "ATK",
        basePercent: 20,
      },
      messages: ["SOURCE makes a second shot at TARGET and deals DAMAGE"],
    },
    {
      type: "damage",
      targetType: "single",
      targetNumber: 3,
      damage: {
        type: "piercing",
        source: "ATK",
        basePercent: 20,
      },
      messages: ["SOURCE makes a third and final shot at TARGET and deals DAMAGE"],
    },
  ],
} satisfies ActionData;

export default {
  name: "unarmed combat",
  category: "combat",
  weaponType: "unarmed",
  levels: [
    { type: "attack", name: "uppercut" },
    { type: "passive", name: "unarmed", target: "damage", value: 10 },
  ],
} satisfies SkillData;

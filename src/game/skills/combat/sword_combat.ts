export default {
  name: "sword combat",
  category: "combat",
  weaponType: "sword",
  levels: [
    { attack: { name: "thrust" } },
    { passive: { name: "sword", target: "damage", value: 10 } },
    { passive: { name: "sword", target: "damage", value: 10 } },
    { passive: { name: "sword", target: "damage", value: 10 } },
    { passive: { name: "sword", target: "damage", value: 10 } },
    { passive: { name: "sword", target: "damage", value: 10 } },
    { passive: { name: "sword", target: "damage", value: 10 } },
    { passive: { name: "sword", target: "damage", value: 10 } },
    { passive: { name: "sword", target: "damage", value: 10 } },
  ],
} satisfies SkillData;

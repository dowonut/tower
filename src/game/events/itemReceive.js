import skills from "../classes/skills.js";

export default {
  name: "itemReceive",
  function: async (obj) => {
    const { item, player } = obj;

    if (!item.weaponType) return;

    const skill = skills.find((x) => x.type == item.weaponType);

    if (!skill) return;
    console.log(skill.name);

    await player.addSkill(skill.name);
  },
};

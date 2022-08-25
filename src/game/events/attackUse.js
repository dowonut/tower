import skillsRef from "../classes/skills.js";

export default {
  name: "attackUse",
  function: async (obj) => {
    const { attack, player } = obj;

    const skills = skillsRef.filter((x) => attack.type.includes(x.type));

    // Give skill xp to skills relating to the attack
    for (const skill of skills) {
      const skillXp = game.random(10, 20);

      await player.giveSkillXp(skillXp, skill.name);
    }
  },
};

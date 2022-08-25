import { loadFiles } from "./_loadFiles.js";

class Skill {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

    this.getName = () => {
      return game.titleCase(this.name);
    };

    // Format level info for skill
    this.levelInfo = (level) => {
      const skill = this.levels[level - 1];

      if (!skill) return undefined;

      if (skill.info) return skill.info;

      if (skill.attack)
        return `Unlock new attack: **${game.titleCase(skill.attack.name)}**`;

      if (skill.passive) {
        const { passive } = skill;
        return `Increase ${
          passive.name
        } ${passive.target.toLowerCase()} by \`+${passive.value}%\``;
      }
    };

    // Level up player skill
    this.levelUp = async (player, level) => {
      let levelMsg;

      // If level unlocks add
      if (level.attack) {
        // Add new attack to player
        await player.addAttack(level.attack.name);
        const attackName = game.titleCase(level.attack.name);
        levelMsg = `New attack unlocked: **${attackName}**`;
      }

      // If level unlocks passive stat
      if (level.passive) {
        const { passive } = level;
        // Add new passive stat to player
        await player.addPassive({
          name: passive.name,
          target: passive.target,
          value: passive.value,
          modifier: "multiply",
          source: "skill",
        });
        const combatName = game.titleCase(`${passive.name}`);
        levelMsg = `${combatName} ${passive.target} increased by \`+${passive.value}%\``;
      }

      // Send level message
      if (!levelMsg) return "";

      return levelMsg;
    };
  }
}

const skills = await loadFiles("skills", Skill);

export default skills;

// export default [
//   new Skill({
//     name: "unarmed combat",
//     levels: [
//       { info: "Unlock new attack `Uppercut`" },
//       { info: "Increase unarmed damage by `5%`" },
//     ],
//   }),
//   new Skill({
//     name: "sword combat",
//     levels: [],
//   }),
//   new Skill({
//     name: "axe combat",
//     levels: [],
//   }),
//   new Skill({
//     name: "spear combat",
//     levels: [],
//   }),
//   new Skill({
//     name: "bow combat",
//     levels: [],
//   }),
//   new Skill({
//     name: "magic",
//     levels: [],
//   }),
//   new Skill({
//     name: "mining",
//     levels: [],
//   }),
//   new Skill({
//     name: "fishing",
//     levels: [],
//   }),
//   new Skill({
//     name: "woodcutting",
//     levels: [],
//   }),
// ];

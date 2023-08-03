import { config } from "../../tower.js";
import {
  createClassFromType,
  loadFiles,
  titleCase,
} from "../../functions/core/index.js";

const SkillBaseClass = createClassFromType<SkillBase>();

export class SkillClass extends SkillBaseClass {
  constructor(object: Generic<SkillBase>) {
    super(object);
  }

  /** Get level info for skill. */
  // levelInfo(level: number) {
  //   const skill = this.levels[level - 1];

  //   if (!skill) return undefined;

  //   if (skill.info) return skill.info;

  //   if (skill.type == "attack")
  //     return `Unlock new attack: **${titleCase(skill.name)}**`;

  //   if (skill.type == "passive") {
  //     const passive = skill;
  //     return `Increase ${passive.name} ${passive.target.toLowerCase()} by \`+${
  //       passive.value
  //     }%\``;
  //   }
  // }

  // Level up player skill
  async levelUp(player: Player, level: SkillLevel) {
    let levelMsg: string;

    // If level unlocks add
    // if (level.type == "attack") {
    //   // Add new attack to player
    //   await player.addAttack(level.name);
    //   const attackName = titleCase(level.name);
    //   levelMsg = `New attack unlocked: **${attackName}**`;
    // }

    // If level unlocks passive stat
    // if (level.type == "passive") {
    //   const passive = level;
    //   // Add new passive stat to player
    //   await player.addPassive({
    //     name: passive.name,
    //     target: passive.target,
    //     value: passive.value,
    //     modifier: "multiply",
    //     source: "skill",
    //   });
    //   const combatName = titleCase(`${passive.name}`);
    //   levelMsg = `${combatName} ${passive.target} increased by \`+${passive.value}%\``;
    // }

    // Send level message
    if (!levelMsg) return "";

    return levelMsg;
  }
}

const skills = await loadFiles<SkillClass>("skills", SkillClass);

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

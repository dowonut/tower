import { game, prisma, config } from "../../tower.js";

/** Give XP to a player skill. */
export default (async function (args: { skillName: string; amount: number; message?: Message }) {
  const { skillName, amount, message } = args;

  let skill = await this.getSkill(skillName);

  if (!skill) {
    await prisma.skill.create({ data: { name: skillName, playerId: this.id, xp: amount } });
    skill = await this.getSkill(skillName);
  } else {
    const newSkill = await prisma.skill.update({
      where: { playerId_name: { playerId: this.id, name: skillName } },
      data: { xp: { increment: amount } },
    });
    skill = Object.assign(skill, newSkill);
  }

  // Calculate xp required for next level
  let nextLevelXp = config.nextLevelXpSkill(skill.level);

  // If level up
  for (let i = 0; skill.xp >= nextLevelXp; i++) {
    // Calculate remaining xp
    const newXp = skill.xp - nextLevelXp;

    // Update player data
    const updatedSkill = await prisma.skill.update({
      where: { playerId_name: { playerId: this.id, name: skillName } },
      data: { xp: newXp, level: { increment: 1 } },
    });
    skill = Object.assign(skill, updatedSkill);

    // Send level up message
    const skillNameCase = game.titleCase(skill.name);
    const { green_arrow } = config.emojis;
    let levelMsg = `
# ${green_arrow} Skill Level Up! ${green_arrow}
Your **${skillNameCase}** skill has reached level ${game.f(skill.level)}`;
    let skillLevelMsg = ``;

    // Fetch data about skill and check if next level exists
    const skillLevel = skill.levels[skill.level - 1];

    // Level up skill
    if (skillLevel) {
      skillLevelMsg = skill.getRewardInfo(skill.level);
    }

    if (message) {
      await game.fastEmbed({ message, reply: true, description: `${levelMsg}\n\n${skillLevelMsg}`, color: "green" });
    }

    // Get required xp for next level
    nextLevelXp = config.nextLevelXpSkill(skill.level);
  }
} satisfies PlayerFunction);

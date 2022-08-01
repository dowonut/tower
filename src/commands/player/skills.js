export default {
  name: "skill",
  aliases: ["sk"],
  arguments: "<skill name>",
  description: "See all your skills or one specific skill.",
  category: "Player",
  async execute(message, args, prisma, config, player, game, server) {
    const input = args.join(" ");

    let embed;
    // If no search provided
    if (!input) {
      // Get all player skills
      const skills = await player.getSkills();
      let description = ``;

      // Iterate through skills
      for (const skill of skills) {
        // Get skill name
        const skillName = skill.getName();

        // Calculate skill xp and progress bar
        const xp = skill.xp;
        const nextXp = config.nextLevelXpSkill(skill.level);
        const progress = game.progressBar(xp, nextXp);

        // Create description
        description += `\n**${skillName}** \`Lvl. ${skill.level}\``;
        description += `\n${progress} \`${xp} / ${nextXp}\``;
      }

      const title = `Skills`;

      // Create embed
      embed = {
        description: description,
        title: title,
        color: config.botColor,
        thumbnail: {
          url: player.pfp,
        },
      };
    } else {
      // Get specific skill
      const skill = await player.getSkill(input);

      // Check if skill exists
      if (!skill) return game.error(message, `not a valid skill.`);

      // Calculate skill xp and progress bar
      const xp = skill.xp;
      const nextXp = config.nextLevelXpSkill(skill.level);
      const progress = game.progressBar(xp, nextXp);

      // Create title and description
      const title = `${skill.getName()}`;
      let description = `
Skill Level: \`${skill.level}\`
XP: \`${xp} / ${nextXp}\`
${progress}\n`;

      // Get info about next skill levels
      for (let i = 1; i < 4 && skill.levelInfo(skill.level + i); i++)
        description += `
\`Level ${skill.level + i}\`
${skill.levelInfo(skill.level + i)}`;

      embed = {
        description: description,
        title: title,
        color: config.botColor,
        thumbnail: {
          url: player.pfp,
        },
      };
    }

    game.sendEmbed(message, embed);
  },
};

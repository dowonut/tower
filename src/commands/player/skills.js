export default {
  name: "skills",
  aliases: ["sk", "skill"],
  arguments: "<skill name>",
  description: "See all your skills or one specific skill.",
  category: "Player",
  useInCombat: true,
  async execute(message, args, config, player, server) {
    const input = args.join(" ");

    let embed, title;
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
        const progress = game.progressBar(xp, nextXp, "xp");

        // Create description
        description += `\n\n**${skillName}**`;
        description += `\n\`Lvl. ${skill.level}\` | \`${xp} / ${nextXp} XP\``;
        description += `\n${progress}`;
      }

      title = `Skills`;

      // Create embed
      embed = {
        description: description,
      };
    } else {
      // Get specific skill
      const skill = await player.getSkill(input);

      // Check if skill exists
      if (!skill) return game.error(message, `not a valid skill.`);

      // Calculate skill xp and progress bar
      const xp = skill.xp;
      const nextXp = config.nextLevelXpSkill(skill.level);
      const progress = game.progressBar(xp, nextXp, "xp");

      // Create title and description
      title = `${skill.getName()}`;
      let description = `
Skill Level: \`${skill.level}\`
${progress}
XP: \`${xp} / ${nextXp}\``;

      // Get info about next skill levels
      for (let i = 1; i < 3 && skill.levelInfo(skill.level + i); i++)
        description += `
\n**Level ${skill.level + i}**
${skill.levelInfo(skill.level + i)}`;

      embed = {
        description: description,
      };
    }

    game.fastEmbed(message, player, embed, title);
  },
};

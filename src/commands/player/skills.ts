import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "skills",
  aliases: ["sk", "skill"],
  arguments: [
    {
      name: "skill",
      required: false,
      filter: async (input, player) => {
        const skill = await player.getSkill(input);
        if (skill) {
          return { success: true, content: skill };
        } else {
          return {
            success: false,
            message: `No skill found with name **\`${input}\`**`,
          };
        }
      },
    },
  ],
  description: "See all your skills or one specific skill.",
  category: "player",
  useInCombat: true,
  async execute(message, args, player, server) {
    const skill = args.skill;

    let embed: Embed, title: string;
    // If no search provided
    if (!skill) {
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
        const progress = game.progressBar({
          min: xp,
          max: nextXp,
          type: "green",
        });

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
      // Check if skill exists
      if (!skill) return game.error({ message, content: `not a valid skill.` });

      // Calculate skill xp and progress bar
      const xp = skill.xp;
      const nextXp = config.nextLevelXpSkill(skill.level);
      const progress = game.progressBar({
        min: xp,
        max: nextXp,
        type: "green",
      });

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

    game.fastEmbed({ message, player, embed, title });
  },
} satisfies Command;

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
    const skill = (args.skill as Skill) || undefined;
    const skills = await player.getSkills();
    const { f } = game;

    const menu = new game.Menu({
      player,
      variables: { currentSkill: skill as Skill },
      boards: [
        { name: "list", message: "listSkills", rows: ["skills"] },
        { name: "selected", message: "skillSelected", rows: ["skills", "return"] },
      ],
      rows: [
        // Skills select menu
        {
          name: "skills",
          type: "menu",
          components: (m) => {
            return {
              id: "skills",
              placeholder: "Select a skill for more info...",
              async function(r, i, s) {
                m.variables.currentSkill = await m.player.getSkill(s);
                m.switchBoard("selected");
              },
              options: skills.map((x) => {
                return { label: x.getName(), value: x.name, default: m.variables.currentSkill?.name == x.name };
              }),
            };
          },
        },
        // Return button
        {
          name: "return",
          type: "buttons",
          components: (m) => [
            {
              id: "return",
              board: "list",
              function() {
                m.variables.currentSkill = undefined;
              },
            },
          ],
        },
      ],
      messages: [
        // List skills
        {
          name: "listSkills",
          async function(m) {
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
              description += `\n**${skillName}**`;
              description += `\n${f(`Lvl. ${skill.level}`)} | ${f(`${xp} / ${nextXp} XP`)}`;
              description += `\n${progress}`;
            }

            const title = `Skills`;

            return game.fastEmbed({ fullSend: false, reply: true, description, title, player });
          },
        },
        // Show specific skill
        {
          name: "skillSelected",
          async function(m) {
            const skill = m.variables.currentSkill;

            // Calculate skill xp and progress bar
            const xp = skill.xp;
            const nextXp = config.nextLevelXpSkill(skill.level);
            const progress = game.progressBar({
              min: xp,
              max: nextXp,
              type: "green",
            });

            // Create title and description
            const title = `${skill.getName()}`;
            let description = `
Skill Level: ${f(skill.level)}
XP: ${f(`${xp} / ${nextXp}`)}
${progress}`;

            // Get info about next skill levels
            for (let i = 1; i < 3 && skill.getRewardInfo(skill.level + i); i++) {
              description += `
**Level ${skill.level + i}**
${skill.getRewardInfo(skill.level + i)}`;
            }

            return game.fastEmbed({ fullSend: false, reply: true, description, title, player });
          },
        },
      ],
    });

    if (skill) {
      menu.init("selected");
    } else {
      menu.init("list");
    }
  },
} satisfies Command;

import _ from "lodash";
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
  async execute(message, args: { skill: Skill }, player, server) {
    const { skill } = args;
    const { f } = game;
    const maxPerPage = 5;
    let filterOptions = ["all", "weapon skills"];
    let sortOptions = ["level", "name"];

    let skillPages = await getSkillPages();

    const menu = new game.Menu({
      player,
      variables: {
        currentSkill: skill || undefined,
        currentPage: 1,
        currentFiltering: filterOptions[0],
        currentSorting: sortOptions[0],
      },
      boards: [
        { name: "list", message: "listSkills", rows: ["skills", "pages", "options"] },
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
              options: skillPages[m.variables.currentPage - 1].map((x) => {
                return {
                  label: x.getName(),
                  value: x.name,
                  default: m.variables.currentSkill?.name == x.name,
                  emoji: x.emoji,
                };
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
        // Pages
        {
          name: "pages",
          type: "buttons",
          components: (m) => [
            {
              id: "pageBack",
              label: "◀",
              disable: m.variables.currentPage == 1 ? true : false,
              function: () => {
                if (m.variables.currentPage == 1) return;
                m.variables.currentPage -= 1;
                m.refresh();
              },
            },
            {
              id: "pageNext",
              label: "▶",
              disable: m.variables.currentPage == skillPages.length ? true : false,
              function: () => {
                if (m.variables.currentPage == skillPages.length) return;
                m.variables.currentPage += 1;
                m.refresh();
              },
            },
          ],
        },
        // Options
        {
          name: "options",
          type: "buttons",
          components: (m) => [
            {
              id: "changeSorting",
              label: `Sorting: ${game.titleCase(m.variables.currentSorting)}`,
              function: async () => {
                sortOptions.push(sortOptions.shift());
                skillPages = await getSkillPages();
                m.variables.currentPage = 1;
                m.variables.currentSorting = sortOptions[0];
                m.refresh();
              },
            },
            {
              id: "changeFilter",
              label: `Filter: ${game.titleCase(m.variables.currentFiltering)}`,
              function: async () => {
                filterOptions.push(filterOptions.shift());
                skillPages = await getSkillPages();
                m.variables.currentPage = 1;
                m.variables.currentFiltering = filterOptions[0];
                m.refresh();
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
            for (const skill of skillPages[m.variables.currentPage - 1]) {
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
              description += `\n${skill.emoji} **${skillName}**`;
              description += `\n${f(`Lvl. ${skill.level}`)} | ${f(`${xp} / ${nextXp} XP`)}`;
              description += `\n${progress}`;
            }

            const title = `Skills`;

            return game.fastEmbed({
              fullSend: false,
              reply: true,
              description,
              title,
              player,
              embed: { footer: { text: `${m.variables.currentPage} / ${skillPages.length}` } },
            });
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
            const title = `${skill.emoji} ${skill.getName()}`;
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

    async function getSkillPages() {
      let skills = await player.getSkills();
      switch (filterOptions[0]) {
        case "weapon skills":
          skills = skills.filter((x) => x.category == "combat" && x.weaponType);
          break;
        default:
          break;
      }
      switch (sortOptions[0]) {
        case "level":
          skills = _.orderBy(skills, ["level", "xp"], ["desc", "desc"]);
          break;
        case "name":
          skills = _.orderBy(skills, ["name"], "desc");
          break;
        default:
          break;
      }
      return _.chunk(skills, maxPerPage);
    }
  },
} satisfies Command;

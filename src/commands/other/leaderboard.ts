import emojis from "../../emojis.js";
import { game, config, client, prisma } from "../../tower.js";

const leaderboardCategories: {
  [key in string]: { key: string; aliases: string[]; emoji?: string };
} = {
  // Basic
  level: { key: "level", aliases: ["lvl", "l"], emoji: emojis.gold_arrow },
  floor: { key: "floor", aliases: ["fl", "f"], emoji: emojis.floor },
  marks: { key: "marks", aliases: ["ma", "mrk", "mar"], emoji: emojis.mark },
  // Traits
  strength: { key: "strength", aliases: ["s", "str"], emoji: emojis.traits.strength },
  defense: { key: "defense", aliases: ["d", "def"], emoji: emojis.traits.defense },
  arcane: { key: "arcane", aliases: ["ar", "arc"], emoji: emojis.traits.arcane },
  vitality: { key: "vitality", aliases: ["v", "vi"], emoji: emojis.traits.vitality },
  // Stats
  maxhp: { key: "maxHP", aliases: ["max hp", "mhp", "hp", "health"], emoji: emojis.stats.maxHP },
  atk: { key: "ATK", aliases: ["attack", "a"], emoji: emojis.stats.ATK },
  mag: { key: "MAG", aliases: ["magic", "m"], emoji: emojis.stats.MAG },
  res: { key: "RES", aliases: ["resistance", "r"], emoji: emojis.stats.RES },
  "mag res": { key: "MAG_RES", aliases: ["magic resistance", "mr"], emoji: emojis.stats.MAG_RES },
  spd: { key: "SPD", aliases: ["speed", "sp"], emoji: emojis.stats.SPD },
  cr: { key: "CR", aliases: ["crit rate"], emoji: emojis.stats.CR },
  cd: { key: "CD", aliases: ["crit damage", "crit dmg"], emoji: emojis.stats.CD },
  ar: { key: "AR", aliases: ["acute rate"], emoji: emojis.stats.AR },
  ad: { key: "AD", aliases: ["acute damage", "acute dmg"], emoji: emojis.stats.AD },
  agr: { key: "AGR", aliases: ["aggro", "ag"], emoji: emojis.stats.AGR },
};

type LeaderboardCategory = keyof typeof leaderboardCategories;

export default {
  name: "leaderboard",
  aliases: ["top", "lb"],
  arguments: [
    {
      name: "category",
      required: false,
      filter: (s) => {
        if (
          !Object.keys(leaderboardCategories).includes(s.toLowerCase()) &&
          !Object.values(leaderboardCategories).some((x) => x.aliases.includes(s.toLowerCase()))
        ) {
          return {
            success: false,
            message: `Not a valid leaderboard category.\nValid categories are: **\`${Object.keys(
              leaderboardCategories
            ).join(", ")}\`**`,
          };
        } else {
          const key = Object.keys(leaderboardCategories).find(
            (key) =>
              key == s.toLowerCase() || leaderboardCategories[key].aliases.includes(s.toLowerCase())
          );
          const content = key; //leaderboardCategories[key].key;
          return { success: true, content } satisfies CommandArgumentFilterResult;
        }
      },
    },
  ],
  description: "Get the top 10 leaderboard for any category.",
  category: "other",
  useInCombat: true,
  async execute(message, args: { category: LeaderboardCategory }, player, server) {
    let { category = "level" } = args;

    const players = await player.getGuildPlayers();

    let sortedPlayers = sortPlayers();

    const menu = new game.Menu({
      player,
      messages: [
        {
          name: "main",
          function: async (m) =>
            await game.fastEmbed({
              player,
              title: `Server Leaderboard (${game.titleCase(leaderboardCategories[category].key)})`,
              fullSend: false,
              reply: true,
              description: await (async () => {
                let text = ``;
                const key = leaderboardCategories[category].key;
                for (let i = 0; i < 10; i++) {
                  if (!sortedPlayers[i] || sortedPlayers[i][key] < 1) continue;
                  const emoji = leaderboardCategories[category]?.emoji || "";
                  text += `\n**${i + 1}.** <@${sortedPlayers[i].user.discordId}> | ${game.f(
                    sortedPlayers[i][key]
                  )} ${emoji}`;
                }
                return text;
              })(),
            }),
        },
      ],
      rows: [
        {
          name: "selectCategory",
          type: "menu",
          components: (m) => ({
            id: "selectCategory",
            options: Object.keys(leaderboardCategories).map((key) => ({
              label: game.titleCase(leaderboardCategories[key].key),
              value: key,
              default: category == key,
              emoji: leaderboardCategories[key].emoji || config.emojis.blank,
            })),
            placeholder: "Select a category to view leaderboard...",
            function: (r, i, s: LeaderboardCategory) => {
              category = s;
              sortedPlayers = sortPlayers();
              m.refresh();
            },
          }),
        },
      ],
      boards: [{ name: "main", rows: ["selectCategory"], message: "main" }],
    });

    menu.init("main");

    /** Function to sort players by some key. */
    function sortPlayers() {
      const key = leaderboardCategories[category].key;
      return players.sort((a, b) => b[key] - a[key]);
    }
  },
} satisfies Command;

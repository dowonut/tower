export default {
  name: "leaderboard",
  aliases: ["top", "lb"],
  arguments: "<category>",
  description: "Get top 10 leaderboard for any category.",
  category: "Other",
  async execute(message, args, prisma, config, player, game, server, client) {
    // Define categories
    const categories = [
      { name: "level", alias: "l" },
      {
        name: "floor",
        alias: "f",
        emoji: config.emojis.floor,
      },
      {
        name: "marks",
        alias: "m",
        emoji: config.emojis.mark,
      },
      {
        name: "health",
        alias: "h",
        variable: "maxHealth",
        emoji: config.emojis.health,
      },
      {
        name: "strength",
        alias: "s",
        emoji: config.emojis.stats.strength,
      },
      {
        name: "defence",
        alias: "d",
        emoji: config.emojis.stats.defence,
      },
      {
        name: "arcane",
        alias: "a",
        emoji: config.emojis.stats.arcane,
      },
      {
        name: "vitality",
        alias: "v",
        emoji: config.emojis.stats.vitality,
      },
    ];

    // Define input
    let input = args[0];
    if (!input) {
      var category = categories[0];
    } else {
      // Get category
      input = input.toLowerCase();
      var category = categories.find(
        (x) => x.name == input || x.alias == input
      );
    }

    // Check if category exists
    if (!category) return game.error(message, `not a valid category.`);

    // Get all players
    const list = await prisma.player.findMany();

    // Sort players by category
    const variable = category.variable ? category.variable : category.name;
    const label = game.titleCase(category.name);
    const sortedList = list.sort((a, b) => b[variable] - a[variable]);

    // Define emoji
    const emoji = category.emoji ? category.emoji : "";

    // Format description
    let description = ``;
    let i = 1;
    for (const player of sortedList) {
      // Define rank
      let rank = `#${i}`;
      if (i == 1) rank = ":first_place:";
      else if (i == 2) rank = ":second_place:";
      else if (i == 3) rank = ":third_place:";
      // Define description
      description += `\n${rank} - **${player.username}** \`${player[variable]}\` ${emoji}`;
      i++;
    }

    const authorRank =
      sortedList.findIndex((x) => x.discordId == message.author.id) + 1;

    if (authorRank > 10) {
      description += `\n───────────`;
      description += `\n#${authorRank} - ${message.author} \`${player[variable]}\` ${emoji}`;
    }

    // Define title
    const title = `${label} Leaderboard`;

    // Define embed
    const embed = {
      description: description,
      color: config.botColor,
      title: title,
    };

    // Return and send embed
    return await game.sendEmbed(message, embed);
  },
};

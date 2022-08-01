export default {
  name: "stats",
  aliases: ["s"],
  arguments: "",
  description: "Check your current stats.",
  category: "Player",
  useInCombat: true,
  async execute(message, args, prisma, config, player, game, server) {
    let description = ``;
    for (const stat of ["strength", "defence", "arcane"]) {
      description += `${config.emojis.stats[stat]} ${game.titleCase(stat)}: \`${
        player[stat]
      }\` | *${config.statInfo[stat]}*\n`;
    }

    if (player.statpoints > 0)
      description += `\nYou have \`${player.statpoints}\` stat points available.\nAssign them with \`${server.prefix}statup <stat> $ <quantity>\``;

    let embed = {
      title: `Stats`,
      thumbnail: { url: player.pfp },
      description: description,
      color: config.botColor,
    };

    game.sendEmbed(message, embed);
  },
};

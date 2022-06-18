export default {
  name: "floor",
  aliases: ["f"],
  category: "Character",
  description: "Show information about your current floor.",
  async execute(message, args, prisma, config, player, game, server) {
    // const embed = {
    //   thumbnail: {
    //     url: player.pfp,
    //   },
    //   title: `Currently on **Floor ${player.floor}**`,
    //   description: `When you've collected the 4 key fragments, use \`${server.prefix}nextfloor\` to progress.`,
    // };

    const content = `you are currently on ${config.emojis.staircase} **Floor ${player.floor}**\nProgress to the next floor with \`${server.prefix}nextfloor\``;

    game.reply(message, content);
  },
};

export default {
  name: "begin",
  description: "Start the game by creating a character.",
  needChar: false,
  ignoreInHelp: true,
  async execute(message, args, prisma, config, player, game, server, client) {
    const auth = message.author;

    if (player) return game.error(message, "you already have a character.");

    player = await game.createPlayer(auth, prisma, game);

    const embed = {
      thumbnail: { url: player.pfp },
      color: config.botColor,
      description: `**${auth.username}**, welcome to **Tower**!\nIn this game you progress and become overpowered while gradually climbing the tower.\nCheck out your profile with \`${server.prefix}profile\`\nBegin exploring the first floor with \`${server.prefix}explore\`\nSee the list of available commands with \`${server.prefix}help\``,
    };

    // Create conditions
    let usedProfile = false;
    let usedExplore = false;

    // Create button menu
    const menu = new game.menu(getButtons, game);

    // Send reply
    const reply = await message.reply({
      embeds: [embed],
      components: [menu.row],
    });

    // Create collector
    await menu.collector(message, reply);

    // Function for getting buttons
    function getButtons() {
      return [
        {
          id: "profile",
          label: "Profile",
          disable: usedProfile ? true : false,
          function: async () => {
            usedProfile = true;
            await menu.updateButtons(reply);
            return game.runCommand(
              "profile",
              client,
              message,
              [],
              prisma,
              game,
              server
            );
          },
        },
        {
          id: "explore",
          label: "Explore",
          disable: usedExplore ? true : false,
          function: async () => {
            usedExplore = true;
            await menu.updateButtons(reply);
            return game.runCommand(
              "explore",
              client,
              message,
              [],
              prisma,
              game,
              server
            );
          },
        },
      ];
    }
  },
};

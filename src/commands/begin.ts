import { game, config, client, prisma } from "../tower.js";

const command: CommandNoPlayer = {
  name: "begin",
  description: "Start the game by creating a character.",
  needChar: false,
  ignoreInHelp: true,
  async execute(message, args, player, server) {
    const auth = message.author;

    if (player)
      return game.error({ message, content: "you already have a character." });

    player = await game.createPlayer(auth, server);

    const embed = {
      thumbnail: { url: player.pfp },
      color: config.botColor,
      description: `**${auth.username}**, welcome to **Tower**!\nIn this game you progress and become overpowered while gradually climbing the tower.\nCheck out your profile with \`${server.prefix}profile\`\nBegin exploring the first floor with \`${server.prefix}explore\`\nSee the list of available commands with \`${server.prefix}help\``,
    };

    // Create conditions
    let usedProfile = false;
    let usedExplore = false;

    // Create button menu
    const buttons = getButtons();
    const row = game.actionRow("buttons", buttons);

    // Send reply
    const botMsg = await game.send({
      message,
      embeds: [embed],
      components: [row],
      reply: true,
    });

    // Create collector
    await game.componentCollector(message, botMsg, buttons);

    // Function for getting buttons
    function getButtons() {
      /** @type {ComponentButton[]} */
      const buttons = [
        {
          id: "profile",
          label: "Profile",
          disable: usedProfile ? true : false,
          function: async () => {
            usedProfile = true;
            return game.runCommand("profile", { message, server });
          },
        },
        {
          id: "explore",
          label: "Explore",
          disable: usedExplore ? true : false,
          function: async () => {
            usedExplore = true;
            return game.runCommand("explore", { message, server });
          },
        },
      ];
      return buttons;
    }
  },
};
export default command;

import { game, config, client, prisma } from "../tower.js";

export default {
  name: "begin",
  description: "Start the game by creating a character.",
  needChar: false,
  ignoreInHelp: true,
  mustUnlock: false,
  async execute(message, args, player, server) {
    const auth = message.author;

    if (player) return game.error({ player, content: "you already have a character." });

    player = await game.createPlayer({ user: auth, server, message });

    const embed = {
      thumbnail: { url: player.user.pfp },
      color: config.defaultEmbedColor,
      description: `**${auth.username}**, welcome to **Tower**!\nIn this game you progress and become overpowered while gradually climbing the tower.\nCheck out your profile with \`${server.prefix}profile\`\nBegin exploring your current region with \`${server.prefix}explore\`\nSee the list of available commands with \`${server.prefix}help\``,
      image: { url: "attachment://banner.png" },
    };

    // Create conditions
    let usedProfile = false;
    let usedExplore = false;

    // Create button menu
    const buttons = getButtons();
    const row = game.actionRow("buttons", buttons);

    // Send reply
    const botMsg = (await game.send({
      player,
      embeds: [embed],
      components: [row],
      reply: true,
      files: [{ attachment: "./assets/bot/banner_icon_wide.png", name: "banner.png" }],
    })) as Message;

    // Create collector
    await game.componentCollector({ player, botMessage: botMsg, components: buttons });

    // Function for getting buttons
    function getButtons() {
      const buttons: Button[] = [
        {
          id: "profile",
          label: "Profile",
          disable: usedProfile ? true : false,
          function: async () => {
            usedProfile = true;
            game.runCommand("profile", { message, server });
            return;
          },
        },
        {
          id: "explore",
          label: "Explore",
          disable: usedExplore ? true : false,
          function: async () => {
            usedExplore = true;
            game.runCommand("explore", { message, server });
            return;
          },
        },
      ];
      return buttons;
    }
  },
} as CommandNoPlayer;

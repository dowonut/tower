export default {
  name: "begin",
  description: "Start the game by creating a character.",
  needChar: false,
  ignoreInHelp: true,
  async execute(message, args, prisma, config, player, game, server) {
    const auth = message.author;

    if (player) return game.error(message, "you already have a character.");

    player = await game.createPlayer(auth, prisma, game);

    const embed = {
      thumbnail: { url: player.pfp },
      color: config.botColor,
      description: `**${auth.username}**, welcome to **Tower**!\nIn this game you progress and become overpowered while gradually climbing the tower.\nCheck out your profile with \`${server.prefix}profile\`\nBegin exploring the first floor with \`${server.prefix}explore\`\nSee the list of available commands with \`${server.prefix}help\``,
    };

    message.reply({ embeds: [embed] });
  },
};

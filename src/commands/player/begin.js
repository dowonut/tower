export default {
  name: "begin",
  description: "Start the game by creating a character.",
  needChar: false,
  async execute(message, args, prisma, config, player, game, server) {
    const auth = message.author;

    if (player)
      return message.channel.send(
        `:x: **${auth.username}**, ` + "you already have a character."
      );

    // Create new user in database
    const playerData = await prisma.player.create({
      data: {
        discordId: auth.id,
        username: auth.username,
        discriminator: auth.discriminator,
        pfp: auth.displayAvatarURL({
          dynamic: false,
          size: 128,
          format: "png",
        }),
        unlockedCommands: ["erase", "begin", "profile", "explore", "help"],
      },
    });

    await prisma.attack.createMany({
      data: [
        { playerId: playerData.id, name: "Punch" },
        { playerId: playerData.id, name: "Uppercut" },
        { playerId: playerData.id, name: "Fire Breath" },
      ],
    });

    player = { ...playerData, ...game.player, prisma };

    // Give apple
    player.giveItem("Apple");

    game.sendEmbed(message, {
      thumbnail: { url: player.pfp },
      color: config.botColor,
      description: `**${auth.username}**, welcome to **Tower**!\nIn this game you progress and become overpowered while gradually climbing the tower.\nCheck out your profile with \`${server.prefix}profile\`\nBegin exploring the first floor with \`${server.prefix}explore\`\nSee the list of available commands with \`${server.prefix}help\``,
    });
  },
};

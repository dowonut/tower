export default {
  name: "begin",
  needChar: false,
  async execute(message, args, prisma, config, player, functions) {
    if (player) return message.reply("You already have a character");

    const auth = message.author;

    // Create new user in database
    await prisma.player.create({
      data: {
        discordId: auth.id,
        username: auth.username,
        discriminator: auth.discriminator,
        pfp: auth.displayAvatarURL({
          dynamic: true,
          size: 128,
          format: "png",
        }),
      },
    });

    functions.sendEmbed(message, {
      color: config.botColor,
      description:
        "Welcome to **Tower**!\nIn this game you progress and become overpowered while slowly climbing the tower.\nCheck out your profile with `-profile`.",
    });
  },
};

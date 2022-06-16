export default {
  name: "begin",
  needChar: false,
  async execute(message, args, prisma, config, player) {
    if (player) return message.reply("You already have a character");

    const auth = message.author;

    // Create new user in database
    const newPlayer = await prisma.player.create({
      data: {
        discordId: auth.id,
        username: auth.username,
        discriminator: auth.discriminator,
        pfp: auth.displayAvatarURL({
          dynamic: true,
          size: 128,
          format: "png",
        }),
        exploration: {
          create: {
            areaId: 1,
          },
        },
      },
    });

    message.reply(
      `Character created successfully! Open your profile with \`-profile\``
    );
  },
};

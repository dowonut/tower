export default {
  createPlayer: async (auth, prisma, game, commands) => {
    // Check if unlocked commands
    const unlockedCommands = commands
      ? commands
      : ["erase", "begin", "profile", "explore", "help"];

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
        unlockedCommands: unlockedCommands,
      },
    });

    await prisma.attack.createMany({
      data: [
        { playerId: playerData.id, name: "Punch" },
        { playerId: playerData.id, name: "Slash" },
      ],
    });

    const player = { ...playerData, ...game.player, prisma };

    // Give apple
    await player.giveItem("Apple");

    return player;
  },
};

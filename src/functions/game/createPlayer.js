export default {
  createPlayer: async (auth, commands) => {
    const defaultCommands = [
      "erase",
      "begin",
      "profile",
      "explore",
      "help",
      "unlockallcommands",
      "settings",
    ];

    // Check if unlocked commands
    const unlockedCommands = commands ? commands : defaultCommands;

    let user = await prisma.user.findUnique({ where: { discordId: auth.id } });
    if (!user) {
      user = await prisma.user.create({ data: { discordId: auth.id } });
    }

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

    const entries = {
      attack: ["punch", "slash", "headsmasher"],
      skill: ["unarmed combat"],
      //      recipe: ["sword handle"],
    };

    for (const [key, value] of Object.entries(entries)) {
      const entryArr = value.map((x) => ({ playerId: playerData.id, name: x }));

      await prisma[key].createMany({ data: entryArr });
    }

    const player = await game.getPlayer({ id: auth.id });

    // Give apple
    await prisma.inventory.createMany({
      data: [
        {
          playerId: player.id,
          name: "apple",
          quantity: 1,
        },
      ],
    });

    return player;
  },
};

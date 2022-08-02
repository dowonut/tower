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
        { playerId: playerData.id, name: "punch" },
        { playerId: playerData.id, name: "slash" },
        { playerId: playerData.id, name: "headsmasher" },
      ],
    });

    await prisma.skill.createMany({
      data: [
        { playerId: playerData.id, name: "unarmed combat" },
        { playerId: playerData.id, name: "sword combat" },
        { playerId: playerData.id, name: "axe combat" },
        { playerId: playerData.id, name: "spear combat" },
        { playerId: playerData.id, name: "ranged combat" },
        //{ playerId: playerData.id, name: "magic" },
        // { playerId: playerData.id, name: "mining" },
        // { playerId: playerData.id, name: "fishing" },
        // { playerId: playerData.id, name: "woodcutting" },
      ],
    });

    const player = { ...playerData, ...game.player, prisma };

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

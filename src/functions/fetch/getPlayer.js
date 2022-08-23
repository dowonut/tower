export default {
  getPlayer: async (message, prisma, id) => {
    const playerId = id ? id : message.author.id;

    let playerData = await prisma.player.findUnique({
      where: { discordId: playerId },
    });

    return playerData;
  },
};

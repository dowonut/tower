export default {
  getPlayer: async (message, prisma) => {
    let playerData = await prisma.player.findUnique({
      where: { discordId: message.author.id },
    });

    return playerData;
  },
};

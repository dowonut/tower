export default {
  getUser: async (message, prisma, id) => {
    const playerId = id ? id : message.author.id;

    const user = await prisma.user.findUnique({
      where: { discordId: playerId },
    });
    if (!user) return undefined;

    return user;
  },
};

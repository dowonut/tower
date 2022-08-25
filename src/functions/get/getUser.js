export default {
  getUser: async (object) => {
    // Check if id provided
    if (!object.message && !object.id)
      return console.log("Must provide either message or id.");

    const playerId = object.id ? object.id : object.message.author.id;

    const user = await prisma.user.findUnique({
      where: { discordId: playerId },
    });
    if (!user) return undefined;

    return user;
  },
};

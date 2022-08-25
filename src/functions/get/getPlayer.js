export default {
  /** This is a function to get a player. */
  getPlayer: async function (object) {
    // Check if id provided
    if (!object.message && !object.id)
      return console.log("Must provide either message or id.");

    // Set player id
    const playerId = object.id ? object.id : object.message.author.id;

    // Get user
    const user = await game.getUser({ id: playerId });

    // Get player from database
    let playerData = await prisma.player.findUnique({
      where: { discordId: playerId },
    });
    // Check if player has entry in database
    if (!playerData) return undefined;

    let player = { ...playerData, ...game.player };

    if (object.message) player.message = object.message;
    if (object.server) player.server = object.server;
    if (user) player.user = user;

    return player;
  },
};

// Possible parameters:
// id: player id
// message: message that triggered function
// server: server model from database

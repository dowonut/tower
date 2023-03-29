import { game, prisma } from "../../tower.js";
/** Get player. */
export default async function getPlayer(args) {
    const { message, discordId, server } = args;
    // Check if id provided
    if (!args.message && !args.discordId)
        return console.error("Must provide either message or Discord id.");
    // Set player id
    const playerId = discordId ? discordId : message.author.id;
    // Get user
    const user = await game.getUser({ discordId: playerId });
    // Get player from database
    let playerData = await prisma.player.findUnique({
        where: { discordId: playerId },
    });
    // Check if player has entry in database-
    if (!playerData)
        return undefined;
    let player = { ...playerData, ...game._player };
    if (message)
        player.message = message;
    if (server)
        player.server = server;
    if (user)
        player.user = user;
    return player;
}
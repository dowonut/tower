import { prisma } from "../../../tower.js";
/** Get a user. */
export default async function getUser(args) {
    // Check if id provided
    if (!args.message && !args.discordId)
        return console.log("Must provide either message or id.");
    const playerId = args.discordId ? args.discordId : args.message.author.id;
    const user = await prisma.user.findUnique({
        where: { discordId: playerId },
    });
    if (!user)
        return undefined;
    return user;
}

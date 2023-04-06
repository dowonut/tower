import { prisma } from "../../../tower.js";

/** Get a user. */
export default async function getUser(args: {
  message?: Message;
  discordId?: string;
}) {
  // Check if id provided
  if (!args.message && !args.discordId)
    throw new Error("Must provide either message or id.");

  const playerId = args.discordId ? args.discordId : args.message.author.id;

  const user: User = await prisma.user.findUnique({
    where: { discordId: playerId },
  });
  if (!user) return;

  return user;
}

import { client, prisma } from "../../../tower.js";

/** Get a user. */
export default async function getUser(args: {
  message?: Message;
  discordId?: string;
}) {
  // Check if id provided
  if (!args.message && !args.discordId)
    throw new Error("Must provide either message or id.");

  const playerId = args.discordId ? args.discordId : args.message.author.id;

  let user: User = await prisma.user.findUnique({
    where: { discordId: playerId },
  });
  if (!user) return;

  // Update user information
  const discordUser = await client.users.fetch(user.discordId);
  if (discordUser && discordUser.username !== user.username) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { username: discordUser.username },
    });
  }

  return user;
}

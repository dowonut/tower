import { game, prisma, playerFunctions } from "../../../tower.js";
import PlayerClass from "../../../game/_classes/players.js";

/** Get player. */
export default async function getPlayer(args: {
  message?: Message;
  discordId?: string;
  server: Server;
}) {
  const { message, discordId, server } = args;

  // Check if id provided
  if (!args.message && !args.discordId)
    throw new Error("Must provide either message or Discord id.");

  // Set player id
  const playerId = discordId ? discordId : message.author.id;

  // Get user
  const user = await game.getUser({ discordId: playerId });

  if (!user) return;

  // Get player from database
  let playerData = await prisma.player.findUnique({
    where: { guildId_userId: { guildId: server.serverId, userId: user.id } },
    include: {
      encounter: { include: { enemies: true, players: true } },
      party: { include: { players: { include: { user: true } } } },
      inventory: true,
    },
  });
  // Check if player has entry in database-
  if (!playerData) return; //throw new Error("No player found.");

  let playerObj: PlayerBase = { ...playerData, ...playerFunctions };

  if (message) playerObj.message = message;
  if (server) playerObj.server = server;
  playerObj.user = user;

  // Create player class instance
  const player: Player = new PlayerClass(playerObj);

  return player;
}

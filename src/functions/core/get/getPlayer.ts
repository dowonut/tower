import { game, prisma, playerFunctions } from "../../../tower.js";
import PlayerClass from "../../../game/_classes/players.js";

/** Get player. */
export default async function getPlayer(
  args: {
    discordId?: string;
    server: Server;
  } & MessageOrChannel
) {
  const { channel, message, discordId, server } = args;

  // console.log("MESSAGE: ", message ? true : false);
  // console.log("CHANNEL: ", channel ? true : false);
  // console.log("DISCORD ID: ", discordId ? true : false);
  // console.log("====================================");

  // Check if valid arguments provided
  if (!message && !discordId)
    throw new Error("Must provide either Message or Discord ID when getting player.");
  if (!channel && !message)
    throw new Error("Must provide either a Message or Channel when getting player.");

  // Set player id
  const playerId = discordId || message.author.id;

  // Get user
  const user = await game.getUser({ discordId: playerId });
  if (!user) return;

  // Get player from database
  const playerData = await prisma.player.findUnique({
    where: { guildId_userId: { guildId: server.serverId, userId: user.id } },
    include: {
      encounter: { include: { enemies: true, players: { include: { user: true } } } },
      party: { include: { players: { include: { user: true } } } },
      statusEffects: true,
      inventory: true,
    },
  });

  // Check if player has entry in database-
  if (!playerData) return; //throw new Error("No player found.");

  let playerObj: PlayerBase = { ...playerData, ...playerFunctions };

  if (message) {
    playerObj.message = message;
    playerObj.channel = message.channel;
  }
  if (channel) playerObj.channel = channel;
  if (server) playerObj.server = server;
  playerObj.user = user;

  // Create player class instance
  let player: Player = new PlayerClass(playerObj);

  // Fetch equipment
  const equipment = await player.getEquipment();
  player.equipment = equipment;

  return player;
}

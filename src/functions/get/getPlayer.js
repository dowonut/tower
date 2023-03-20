import { game, prisma } from "../../tower.js";

/**
 * Get player from database.
 * @param {object} object
 * @param {*} [object.message] - Message object.
 * @param {string} [object.id] - User Discord id.
 * @param {*} object.server - Server object.
 * @returns Player object.
 */
export default async function getPlayer(object) {
  const { message, id, server } = object;

  // Check if id provided
  if (!object.message && !object.id)
    return console.log("Must provide either message or id.");

  // Set player id
  const playerId = id ? id : message.author.id;

  // Get user
  const user = await game.getUser({ id: playerId, prisma });

  // Get player from database
  let playerData = await prisma.player.findUnique({
    where: { discordId: playerId },
  });
  // Check if player has entry in database-
  if (!playerData) return undefined;

  let player = { ...playerData, ...game._player };

  if (object.message) player.message = object.message;
  if (object.server) player.server = object.server;
  if (user) player.user = user;
  -console.log(player);

  return player;
}

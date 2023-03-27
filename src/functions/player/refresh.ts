import { game } from "../../tower.js";

/**
 * Reinitialise player object.
 */
export default (async function () {
  const player = await game.getPlayer({
    discordId: this.discordId,
    server: this.server,
  });

  return player as Player;
} satisfies PlayerFunction);

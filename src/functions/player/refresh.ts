import { game } from "../../tower.js";

/**
 * Reinitialise player object.
 */
export default (async function () {
  const player = await game.getPlayer({
    discordId: this.user.discordId,
    server: this.server,
    message: this.message,
    channel: this.channel,
  });

  return player as Player;
} satisfies PlayerFunction);

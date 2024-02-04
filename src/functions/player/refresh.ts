import { config, game, prisma } from "../../tower.js";

/**
 * Reinitialise player object.
 */
export default (async function () {
  // const player = await game.getPlayer({
  //   discordId: this.user.discordId,
  //   server: this.server,
  //   message: this.message,
  //   channel: this.channel,
  // });

  // return player as Player;
  const playerData = await prisma.player.findUnique({
    where: { id: this.id },
    include: config.playerInclude,
  });
  return Object.assign(this, playerData);
} satisfies PlayerFunction);

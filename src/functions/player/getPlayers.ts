import { game, prisma } from "../../tower.js";

/** Get all players from the current guild as instanced classes. */
export default (async function () {
  const playersData = await prisma.player.findMany({ where: { guildId: this.guildId }, include: { user: true } });

  const players: Player[] = await Promise.all(
    playersData.map(
      async (p) => await game.getPlayer({ discordId: p.user.discordId, server: this.server, channel: this.channel })
    )
  );

  return players;
} satisfies PlayerFunction);

import { TextChannel } from "discord.js";
import { game, prisma, config, client } from "../../../tower.js";

/** Handle untracked dungeons after the bot restarts. */
export default async function cleanDungeons() {
  const dungeons = await prisma.dungeon.findMany({
    include: { players: { include: { user: true } } },
  });

  for (const dungeon of dungeons) {
    if (!dungeon.discordChannelId) continue;
    try {
      const channel = (await client.channels.fetch(dungeon.discordChannelId)) as TextChannel;
      // Delete original encounter message
      try {
        // console.log(encounter.discordMessageId);
        const message = await channel.messages.fetch({
          message: dungeon.discordMessageId,
          force: true,
          cache: true,
        });
        // console.log(message);
        await message.delete();
      } catch (err) {
        // console.error(err);
      }

      // Fetch players
      const server = await prisma.server.findUnique({
        where: { serverId: channel.guild.id },
      });
      const players = await Promise.all(
        dungeon.players.map(async (x) => {
          return await game.getPlayer({ discordId: x.user.discordId, server, channel });
        })
      );

      // Define leader
      let leader: Player;
      if (players.length > 1) {
        leader = players.find((x) => x.isPartyLeader);
      } else {
        leader = players[0];
      }

      // Get dungeon class instance
      const finalDungeon = await leader.getDungeon();

      // Start new dungeon instance
      game.handleDungeon({ dungeon: finalDungeon, players, leader });
    } catch (err) {
      console.error(err);
    }
  }
}

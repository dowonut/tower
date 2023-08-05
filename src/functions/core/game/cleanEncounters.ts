import { TextChannel } from "discord.js";
import { game, prisma, config, client } from "../../../tower.js";

/** Handle untracked encounters after the bot restarts. */
export default async function cleanEncounters() {
  const encounters = await prisma.encounter.findMany({
    include: { enemies: true, players: { include: { user: true } } },
  });

  for (const encounter of encounters) {
    try {
      const channel = (await client.channels.fetch(encounter.discordChannelId)) as TextChannel;
      // Delete original encounter message
      try {
        // console.log(encounter.discordMessageId);
        const message = await channel.messages.fetch({ message: encounter.discordMessageId, force: true, cache: true });
        // console.log(message);
        await message.delete();
      } catch (err) {
        // console.error(err);
      }

      // Fetch enemies and players
      const enemies = encounter.enemies.map((x) => {
        const enemyClass = game.getEnemy(x.name);
        return game.createClassObject(enemyClass, x) as Enemy;
      });
      const server = await prisma.server.findUnique({
        where: { serverId: channel.guild.id },
      });
      const players = await Promise.all(
        encounter.players.map(async (x) => {
          return await game.getPlayer({ discordId: x.user.discordId, server });
        })
      );

      // Get turn order
      const turnOrder = game.getTurnOrder({ players, enemies });

      // Start new encounter
      game.handleEncounter({ channel, enemies, players, encounter, turnOrder });
    } catch (err) {
      console.error(err);
    }
  }
}

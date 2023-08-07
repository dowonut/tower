import { User as DiscordUser } from "discord.js";
import { config, game, prisma } from "../../../tower.js";

/**
 * Create a new player given a Discord user.
 */
export default async function createPlayer(user: DiscordUser, server: Server) {
  const defaultCommands = ["erase", "begin", "profile", "explore", "help", "unlockallcommands", "settings"];

  // Check if unlocked commands
  const unlockedCommands = defaultCommands;

  // Create new user if it doesn't exist
  let userData = await prisma.user.findUnique({
    where: { discordId: user.id },
  });
  if (!userData) {
    userData = await prisma.user.create({
      data: {
        discordId: user.id,
        username: user.username,
        discriminator: user.discriminator,
        pfp: user.displayAvatarURL({
          size: 128,
          extension: "png",
        }),
        unlockedCommands: unlockedCommands,
      },
    });
  }

  // Create new player in database
  const playerData = await prisma.player.create({
    data: {
      userId: userData.id,
      guildId: server.serverId,
    },
  });

  const entries = config.playerDefaultEntries;

  for (const [key, value] of Object.entries(entries)) {
    const entryArr = value.map((x) => ({ playerId: playerData.id, name: x }));

    await prisma[key].createMany({ data: entryArr });
  }

  const player = await game.getPlayer({ discordId: user.id, server });

  // Give apple
  await prisma.inventory.createMany({
    data: [
      {
        playerId: player.id,
        name: "apple",
        quantity: 1,
      },
    ],
  });

  return player;
}

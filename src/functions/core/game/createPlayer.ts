import { GuildMember, User as DiscordUser } from "discord.js";
import { game, prisma } from "../../../tower.js";

/**
 * Create a new player given a Discord user.
 */
export default async function createPlayer(
  user: DiscordUser,
  server: Server,
  commands?: string[]
) {
  const defaultCommands = [
    "erase",
    "begin",
    "profile",
    "explore",
    "help",
    "unlockallcommands",
    "settings",
  ];

  // Check if unlocked commands
  const unlockedCommands = commands ? commands : defaultCommands;

  // Create new user if it doesn't exist
  let userData = await prisma.user.findUnique({
    where: { discordId: user.id },
  });
  if (!userData) {
    await prisma.user.create({ data: { discordId: user.id } });
  }

  // Create new player in database
  const playerData = await prisma.player.create({
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

  const entries = {
    attack: ["punch", "slash", "headsmasher"],
    skill: ["unarmed combat"],
    //      recipe: ["sword handle"],
  };

  for (const [key, value] of Object.entries(entries)) {
    const entryArr = value.map((x) => ({ playerId: playerData.id, name: x }));

    await prisma[key].createMany({ data: entryArr });
  }

  const player = await game.getPlayer({ discordId: user.id, server });
  if (!player) return;

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

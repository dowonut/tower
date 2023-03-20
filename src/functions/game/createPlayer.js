import { game, prisma } from "../../tower.js";

/**
 * Create a new player given a Discord user.
 * @param {object} user - Discord user object.
 * @param {object} server - Server object.
 * @param {string[]} [commands] - User's unlocked commands.
 * @returns Player
 */
export default async function createPlayer(user, server, commands) {
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
        dynamic: false,
        size: 128,
        format: "png",
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

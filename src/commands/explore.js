export default {
  name: "explore",
  description:
    "Explore the current floor you're on. You may encounter enemies, dungeons, loot, or more!",
  aliases: ["e"],
  async execute(message, args, prisma, config, player, game, server) {
    await game.startEnemyEncounter(
      message,
      args,
      prisma,
      config,
      player,
      game,
      server
    );
  },
};

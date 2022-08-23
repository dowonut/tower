export default {
  name: "flee",
  aliases: ["fl"],
  description: "Attempt to flee from the enemy you're fighting.",
  category: "Combat",
  useInCombatOnly: true,
  async execute(message, args, prisma, config, player, game, server, client) {
    const enemy = await player.getCurrentEnemy();

    player.exitCombat();
    player.killEnemy(enemy);

    const reply = await game.reply(message, "you ran away!");

    // Add explore button
    return game.cmdButton(message, reply, game, [
      "explore",
      client,
      message,
      [],
      prisma,
      game,
      server,
    ]);
  },
};

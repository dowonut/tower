export default {
  name: "flee",
  aliases: ["fl"],
  description: "Attempt to flee from the enemy you're fighting.",
  category: "Combat",
  useInCombatOnly: true,
  async execute(message, args, prisma, config, player, game, server) {
    const enemy = await player.getCurrentEnemy();

    player.exitCombat();
    player.killEnemy(enemy);

    message.channel.send("you ran away like a fucking loser");
  },
};

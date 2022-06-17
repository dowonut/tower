export default {
  name: "flee",
  aliases: ["f"],
  description: "Attempt to flee from the enemy you're fighting.",
  category: "Combat",
  useInCombatOnly: true,
  async execute(message, args, prisma, config, player, game, server) {
    player.exitCombat();

    message.channel.send("you ran away like a fucking loser");
  },
};

export default {
  name: "flee",
  aliases: ["fl"],
  description: "Attempt to flee from the enemy you're fighting.",
  category: "Combat",
  useInCombatOnly: true,
  async execute(message, args, config, player, server) {
    const enemy = await player.getCurrentEnemy();

    player.exitCombat();
    player.killEnemy(enemy);

    const reply = await game.reply(message, "you ran away!");

    // Add explore button
    return game.cmdButton(message, reply, ["explore", message, [], server]);
  },
};

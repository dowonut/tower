import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "flee",
  aliases: ["fl"],
  description: "Attempt to flee from the enemy you're fighting.",
  category: "combat",
  useInCombatOnly: true,
  async execute(message, args, player, server) {
    const enemy = await player.getCurrentEnemy();

    player.exitCombat();
    player.killEnemy(enemy);

    const reply = await game.send({
      message,
      content: "you ran away!",
      reply: true,
    });

    // Add explore button
    return game.cmdButton(message, reply, ["explore", message, [], server]);
  },
};

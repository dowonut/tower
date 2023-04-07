import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "flee",
  aliases: ["fl"],
  description: "Attempt to flee from the enemy you're fighting.",
  category: "combat",
  useInCombatOnly: true,
  async execute(message, args, player, server) {
    //const enemy = await player.getEnemy();

    player.exitCombat();
    player.killEnemy();

    const reply = await game.send({
      message,
      content: "You ran away!",
      reply: true,
    });

    // Add explore button
    return game.commandButton({ message, reply, server, command: "explore" });
  },
} as Command;

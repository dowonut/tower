import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "flee",
  aliases: ["fl"],
  description: "Attempt to flee from the enemy you're fighting.",
  category: "combat",
  useInCombatOnly: true,
  async execute(message, args, player, server) {
    //const enemy = await player.getEnemy();

    if (player.inCombat) {
      const response = await player.exitCombat(message);

      if (response !== "success") return;

      let content = `You ran away!`;
      if (player.party)
        content = `${player.ping} ran away and took the party with them!`;

      const reply = await game.send({
        message,
        content,
        reply: true,
      });

      // Add explore button
      game.commandButton({ message, reply, server, command: "explore" });

      return "success";
    }
  },
} as Command;

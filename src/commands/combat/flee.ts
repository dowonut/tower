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
      // Check if player can take an action
      if (!player.canTakeAction)
        return game.error({ player, content: `you can't flee right now.` });

      const response = await player.exitCombat();

      if (response !== "success") return;

      let content = `You ran away!`;
      if (player.party) content = `You ran away and took the party with you!`;

      const botMessage = await game.send({
        player,
        content,
        reply: true,
      });

      // Add explore button
      game.commandButton({
        player,
        botMessage,
        commands: [{ name: "explore" }],
      });

      return "success";
    }
  },
} as Command;

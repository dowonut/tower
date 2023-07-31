import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "forgetallcommands",
  aliases: ["fac"],
  description: "Forget all commands in the game.",
  category: "admin",
  async execute(message, args, player, server) {
    await player.update({ user: { update: { unlockedCommands: [] } } });

    game.send({
      message,
      content: "**Forgot all commands** :white_check_mark:",
      reply: true,
    });
  },
} as Command;

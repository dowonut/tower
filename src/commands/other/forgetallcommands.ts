import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "forgetallcommands",
  aliases: ["fac"],
  description: "Forget all commands in the game.",
  category: "other",
  async execute(message, args, player, server) {
    await player.update({ user: { update: { unlockedCommands: config.defaultCommands } } });

    game.send({
      player,
      content: "**Forgot all commands** :white_check_mark:",
      reply: true,
    });
  },
} as Command;

import { game, config, client, prisma } from "../../tower.js";

/** @type {import('../../types.js').Command} */
export default {
  name: "forgetallcommands",
  aliases: ["fac"],
  arguments: "",
  description: "Forget all commands in the game.",
  category: "admin",
  async execute(message, args, player, server) {
    await player.update({ unlockedCommands: [] });

    return game.send({
      message,
      content: "forgot all commands :white_check_mark:",
      reply: true,
    });
  },
};

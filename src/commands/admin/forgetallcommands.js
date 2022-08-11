import fs from "fs";
import path from "path";

export default {
  name: "forgetallcommands",
  aliases: ["fac"],
  arguments: "",
  description: "Forget all commands in the game.",
  category: "Admin",
  async execute(message, args, prisma, config, player, game, server) {
    await player.update({ unlockedCommands: [] });

    return game.reply(message, "forgot all commands :white_check_mark:");
  },
};

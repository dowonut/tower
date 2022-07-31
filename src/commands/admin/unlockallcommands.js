import fs from "fs";
import path from "path";

export default {
  name: "unlockallcommands",
  aliases: ["uac"],
  arguments: "",
  description: "Unlock all commands in the game.",
  category: "Admin",
  async execute(message, args, prisma, config, player, game, server) {
    let commands = [];
    let commandFiles = [];
    function throughDirectory(directory, array) {
      fs.readdirSync(directory).forEach((file) => {
        const absolute = path.join(directory, file);
        if (fs.statSync(absolute).isDirectory())
          return throughDirectory(absolute, array);
        else return array.push(absolute);
      });
    }
    throughDirectory("./src/commands", commandFiles);

    for (const file of commandFiles) {
      const { default: command } = await import(`../../../${file}`);
      commands.push(command.name);
    }

    await player.update({ unlockedCommands: commands });

    return game.reply(message, "unlocked all commands :white_check_mark:");
  },
};

import fs from "fs";
import path from "path";

export default {
  name: "unlockedcommands",
  aliases: ["uc"],
  arguments: "",
  description: "Check unlocked commands.",
  category: "Admin",
  async execute(message, args, config, player, server) {
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

    let description = ``;
    for (const file of commandFiles) {
      const { default: command } = await import(`../../../${file}`);

      if (command.category == "Admin") continue;

      if (player.unlockedCommands.includes(command.name)) {
        description += `**\`${command.name}\`** :white_check_mark:`;
      } else {
        description += `\`${command.name}\``;
      }
      description += `\n`;
    }

    let embed = { description: description, title: `Unlocked Commands` };

    game.sendEmbed(message, embed);
  },
};

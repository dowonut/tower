import { game } from "../../tower.js";

export default {
  name: "unlockedcommands",
  aliases: ["uc"],
  description: "Check unlocked commands.",
  category: "admin",
  async execute(message, args, player, server) {
    const commands = await game.getCommands();

    let description = ``;
    for (const command of commands) {
      //if (command.category == "admin") continue;

      if (player.user.unlockedCommands.includes(command.name)) {
        description += `**\`${command.name}\`** :white_check_mark:`;
      } else {
        description += `${command.name}`;
      }
      description += `\n`;
    }

    let embed = { description: description };

    game.fastEmbed({ message, player, title: `Unlocked Commands`, embed });
  },
} as Command;

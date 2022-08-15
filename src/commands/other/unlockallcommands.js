import fs from "fs";
import path from "path";

export default {
  name: "unlockallcommands",
  aliases: ["uac"],
  arguments: "",
  description: "Unlock all commands in the game.\nNOT RECOMMENDED.",
  category: "Other",
  async execute(message, args, prisma, config, player, game, server) {
    const buttons = [
      {
        id: "yes",
        label: "✔ Yes, unlock all commands.",
        style: "success",
        function() {
          return "yes";
        },
      },
      {
        id: "no",
        label: "✖",
        style: "danger",
        function() {
          return "no";
        },
      },
    ];

    const row = game.actionRow("buttons", buttons);

    const reply = await message.reply({
      content: `
Are you sure you want to unlock all commands?
This will skip all tutorials, so it's **only recommended for experienced players.**`,
      components: [row],
    });

    const result = await game.componentCollector(message, reply, buttons);

    // If yes, unlock all commands
    if (result == "yes") {
      await unlockCommands();
      return await reply.edit({
        content: "**`Unlocked all commands`** :white_check_mark:",
        components: [],
      });
    }
    // If no, then cancel
    else if (result == "no") {
      return await reply.edit({
        content: "**`Cancelled operation`**",
        components: [],
      });
    }

    async function unlockCommands() {
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
    }
  },
};

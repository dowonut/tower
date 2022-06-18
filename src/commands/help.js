import fs from "fs";
import path from "path";

export default {
  name: "help",
  aliases: ["h"],
  useInCombat: true,
  ignoreInHelp: true,
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
      const { default: command } = await import(`../../${file}`);
      commands.push(command);
    }

    let categories = {
      General: `
**General**
        `,
      Character: `
**Character**
        `,
      Combat: `
**Combat**
        `,
      Settings: `
**Settings**
        `,
    };

    for (const command of commands) {
      if (command.ignoreInHelp !== true) {
        let commandName = command.name;
        if (command.arguments)
          commandName = `${command.name} ${command.arguments}`;

        const template = `**\`${server.prefix}${commandName}\`** | ${command.description}\n`;

        if (!command.category) {
          categories.General += template;
        } else {
          categories[command.category] += template;
        }
      }
    }

    let description = ``;

    for (const [key, value] of Object.entries(categories)) {
      description += `${value}`;
    }

    const embed = {
      color: config.botColor,
      title: "Game Commands",
      thumbnail: {
        url: config.botIcon,
      },
      description: description,
    };

    game.sendEmbed(message, embed);
  },
};

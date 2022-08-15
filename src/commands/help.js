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
    const authorPerms = message.channel.permissionsFor(message.author);
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
${config.emojis.bullet} **General:**

        `,
      Player: `
${config.emojis.bullet} **Player**

        `,
      Location: `
${config.emojis.bullet} **Location**

        `,
      Items: `
${config.emojis.bullet} **Items**

        `,
      Crafting: `
${config.emojis.bullet} **Crafting**

        `,
      Combat: `
${config.emojis.bullet} **Combat**

        `,
      Settings: `
${config.emojis.bullet} **Settings**

        `,
      Other: `
${config.emojis.bullet} **Other**

        `,
      Admin: `
${config.emojis.bullet} **Admin**

        `,
    };

    for (const command of commands) {
      if (
        command.ignoreInHelp !== true &&
        (player.unlockedCommands.includes(command.name) ||
          command.category == "Settings" ||
          (command.category == "Admin" && authorPerms.has(["ADMINISTRATOR"])))
      ) {
        let commandName = command.name;
        if (command.arguments)
          commandName = `${command.name} ${command.arguments}`;

        const template = `\`${server.prefix}${commandName}\` | ${command.description}\n`;

        if (!command.category) {
          categories.General += template;
        } else {
          categories[command.category] += template;
        }
      }
    }

    let description = ``;

    for (const [key, value] of Object.entries(categories)) {
      const lineBreaks = value.split(/\r\n|\r|\n/).length;

      if (lineBreaks > 4) description += `${value}`;
    }

    const embed = {
      color: config.botColor,
      title: "Game Commands",
      thumbnail: {
        url: config.botIcon,
      },
      description: description,
      footer: {
        text: `All commands have shortcuts. Example: ${server.prefix}profile is also ${server.prefix}p`,
      },
    };

    message.author.send({ embeds: [embed] });
    game.reply(message, `check your DMs!`);
  },
};

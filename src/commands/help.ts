import { PermissionsBitField } from "discord.js";
const ADMIN = PermissionsBitField.Flags.Administrator;

import { game, config, client, prisma } from "../tower.js";

export default {
  name: "help",
  description: "Get help!",
  aliases: ["h"],
  arguments: [{ name: "category", type: "commandCategory", required: false }],
  useInCombat: true,
  ignoreInHelp: true,
  useInDungeon: true,
  // needChar: false,
  async execute(message, args, player, server) {
    const allCommands = await game.getCommands();
    const authorPerms = message.channel.permissionsFor(message.author);

    // Filter commands according to user
    let allCommandsFiltered: Command[] = [];
    for (const command of allCommands) {
      // Check if user is admin
      if (command.category == "admin" && !authorPerms.has(ADMIN)) continue;
      // Check if user is Dowonut
      if (command.dev && message.author.id !== config.developerId) continue;
      // Check if command is unlocked
      if (
        !player.user.unlockedCommands.includes(command.name) &&
        message.author.id !== config.developerId
      )
        continue;

      allCommandsFiltered.push(command);
    }

    // Create and format commands object
    let commandObject: {
      [key in CommandCategory]?: { commands: Command[]; text: string };
    } = {};
    let selectMenu: SelectMenu = {
      id: "category_select",
      placeholder: "Choose a category...",
      options: [],
      async function(reply, i, selection: CommandCategory) {
        await switchCategory(selection);
      },
    };

    let currentCategory: CommandCategory = args.category || "general";

    for (const category of config.commandCategories) {
      commandObject[category] = { commands: [], text: "" };
      let commands: Command[];
      switch (category) {
        case "general":
          commands = allCommandsFiltered.filter((x) => x.category == category || !x.category);
          break;
        default:
          commands = allCommandsFiltered.filter((x) => x.category == category);
          break;
      }
      commandObject[category].commands = commands;

      // Format arguments
      let categoryText = commands
        .map((x) => {
          let text = `${server.prefix}${x.name}`;
          let args = ``;
          if (x.arguments) {
            for (const arg of x.arguments) {
              let argName = arg.name.replaceAll("_", " ");
              if (arg.required !== false) {
                args += ` <${argName}>`;
              } else {
                args += ` [${argName}]`;
              }
            }
          }
          let finalText = `**\`${text}${args}\`** | ${x.description}`;
          return finalText;
        })
        .join("\n");

      commandObject[category].text = categoryText;

      let helpText = `*Arguments enclosed by \`<>\` are required, and arguments enclosed by \`[]\` are optional.\nAll commands have shortcuts. For example: \`${server.prefix}h\` is the same as \`${server.prefix}help\`*`;

      if (category == "general") {
        commandObject[category].text = helpText + `\n\n` + categoryText;
      }

      if (category == "admin" && !authorPerms.has(ADMIN)) {
        continue;
      } else if (commands.length < 1) {
        continue;
      } else {
        selectMenu.options.push({
          label: game.titleCase(category),
          value: category,
          description: config.commandCategoryDescriptions[category],
          // default: category == currentCategory ? true : false,
        });
      }
    }

    if (currentCategory == "admin" && !authorPerms.has(ADMIN))
      return game.error({ player, content: `this is only for admins, silly` });

    const embed = getEmbed();

    const row = game.actionRow("menu", selectMenu);

    const botMsg = await game.send({
      player,
      embeds: [embed],
      components: [row],
      files: [{ attachment: "./assets/bot/banner_icon_wide.png", name: "banner.png" }],
    });

    game.componentCollector({ player, botMessage: botMsg, components: [selectMenu] });

    function getEmbed() {
      const embed: Embed = {
        title: `**${game.titleCase(currentCategory)} Commands**`,
        thumbnail: { url: config.botIcon },
        description: `${commandObject[currentCategory].text}`,
        color: config.towerColor,
        image: { url: "attachment://banner.png" },
      };

      return embed;
    }

    async function switchCategory(newCategory: CommandCategory) {
      currentCategory = newCategory;

      const embed = getEmbed();

      await botMsg.edit({ embeds: [embed] });
    }
  },
} as Command;

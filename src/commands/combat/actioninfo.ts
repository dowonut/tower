import { Menu } from "../../functions/core/index.js";
import { game } from "../../tower.js";

export default {
  name: "actioninfo",
  aliases: ["ai"],
  description: "View information about a specific action.",
  category: "combat",
  useInCombat: true,
  arguments: [
    {
      name: "action_name",
      required: true,
      type: "playerAction",
    },
  ],
  async execute(message, args: { action_name: Action }, player, server) {
    const { action_name: action } = args;

    const menu = new game.Menu({
      player,
      boards: [{ name: "main", rows: [], message: "main" }],
      rows: [],
      messages: [
        {
          name: "main",
          function: async (m) => await getMessage(m),
        },
      ],
    });

    menu.init("main");

    /** Get message */
    async function getMessage(m: Menu<any>) {
      switch (action.type) {
        // Weapon attack
        case "weapon_attack":
          let description = `*${action?.description}*\n`;
          let info = action.getInfo();
          const image = action.getImage();
          description += `\n${info}\n`;
          return game.fastEmbed({
            player,
            fullSend: false,
            title: `${action.getName()} | \`Lvl. ${action.level}\``,
            description,
            files: [image],
            thumbnail: "attachment://image.png",
          });
        // Ability
        case "ability":
          break;
        // Magic
        case "magic":
          break;
      }
    }
  },
} satisfies Command;
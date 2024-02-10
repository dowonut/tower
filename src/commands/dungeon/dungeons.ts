import _ from "lodash";
import { game } from "../../tower.js";
import emojis from "../../emojis.js";

export default {
  name: "dungeons",
  aliases: ["d"],
  description: "View your available dungeons on the current floor.",
  category: "dungeon",
  unlockCommands: ["enterdungeon"],
  async execute(message, args, player, server) {
    const exploration = player.exploration.filter(
      (x) => x.type == "dungeon" && x.floor == player.floor
    );

    // Check if player has any dungeons
    if (_.isEmpty(exploration))
      return game.error({
        player,
        content: `you have not discovered any dungeons on this floor...`,
      });

    // Fetch dungeon classes
    let dungeons: Dungeon[] = [];
    for (const explore of exploration) {
      dungeons.push(game.get("dungeons", explore.name));
    }

    const menu = new game.Menu({ player, variables: { selectedDungeon: undefined as string } });

    menu.setMessages([
      {
        name: "main",
        function: (m) => {
          const title = `Dungeons on Floor ${player.floor}`;
          let description = ``;
          for (const dungeon of dungeons) {
            let emoji = ``;
            if (m.variables.selectedDungeon) emoji = emojis.blank + " ";
            if (m.variables.selectedDungeon == dungeon.name) emoji = "👉 ";
            description += `${emoji}**${dungeon.getName()}**\n`;
          }
          // Add selected dungeon information
          if (m.variables.selectedDungeon) {
            const dungeon = dungeons.find((x) => x.name == m.variables.selectedDungeon);
            description += `\n*${dungeon.description}*`;
          }
          return game.fastEmbed({ player, fullSend: false, ping: true, description, title });
        },
      },
    ]);

    menu.setRows([
      {
        name: "select_dungeon",
        type: "menu",
        components: (m) => ({
          id: "select_dungeon",
          placeholder: "Select a dungeon for more information...",
          options: dungeons.map((d) => ({
            label: d.getName(),
            value: d.name,
            description: d.description,
            default: m.variables.selectedDungeon == d.name,
          })),
          function: (r, i, s) => {
            m.variables.selectedDungeon = s;
            m.switchBoard("dungeon_selected");
          },
        }),
      },
      {
        name: "options",
        type: "buttons",
        components: (m) => [
          {
            id: "enter_dungeon",
            label: "Enter Dungeon",
            style: "success",
            emoji: emojis.enter,
            disable: !_.isEmpty(m.player.dungeon),
            function: async () => {
              await game.runCommand("enterdungeon", {
                discordId: m.player.user.discordId,
                channel: m.player.channel,
                server: m.player.server,
                args: [m.variables.selectedDungeon],
              });
              m.refresh();
            },
          },
        ],
      },
    ]);

    menu.setBoards([
      { name: "main", message: "main", rows: ["select_dungeon"] },
      { name: "dungeon_selected", message: "main", rows: ["select_dungeon", "options"] },
    ]);

    menu.init("main");
  },
} satisfies Command;

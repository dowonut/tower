import { game, config, client, prisma } from "../../tower.js";
import floors from "../../game/_classes/floors.js";

export default {
  name: "floor",
  aliases: ["f"],
  unlockCommands: ["travel", "region"],
  category: "location",
  description: "View information about the current floor.",
  useInCombat: true,
  async execute(message, args, player, server) {
    // Get player floor information
    let floor = floors[player.floor - 1];

    // Get initial embed
    const { embed, title, image } = getEmbed(player);

    // Get dropdown menu
    const menu = dropDown(player);
    const row = game.actionRow("menu", menu);

    const reply = await game.fastEmbed({
      player,
      embed,
      title,
      components: [row],
      files: [image],
    });

    // Create collector
    await game.componentCollector({ player, botMessage: reply, components: [menu] });

    // Embed function
    function getEmbed(player) {
      // Create description
      let description = ``;
      // Go through regions
      for (const region of floor.regions) {
        // Get region name
        const regionName = `\`${game.titleCase(region.name)}\``;
        const recLevel = floor.getRecommendedLevelForRegion(region.name);

        // Check if player is at current region and update title
        if (player.region !== region.name) {
          description += `\n${config.emojis.blank}${regionName}`;
        } else {
          description += `\n:round_pushpin:**${regionName}**`;
        }

        // Check if region has activities
        if (region.activities) {
          description += ` | `;
          for (const activity of region.activities) {
            description += `${config.emojis.activities[activity.name]}`;
          }
        }
        if (recLevel) {
          description += ` | Rec. lvl: **\`${recLevel}\`**`;
        }
      }
      //description += `\n\nTravel to a new region with \`${server.prefix}travel <region name>\``;
      const image = game.getRegionImage({
        name: floor.regions.find((x) => x.name == player.region).name,
      });

      const title = `Floor ${player.floor} Regions`;
      const embed = {
        description: description,
        image: { url: "attachment://region.png" },
      };

      return { embed, title, image };
    }

    // Dropdown function
    function dropDown(player) {
      let options = [];
      for (const region of floor.regions) {
        options.push({
          default: player.region == region.name,
          label: game.titleCase(region.name),
          value: region.name,
          description: region.description,
        });
      }

      const menu: SelectMenu = {
        id: "menu",
        placeholder: "Choose a region to travel to...",
        options: options,
        function: async (reply, i, selection) => {
          await travel(selection);
        },
      };

      return menu;
    }

    // Travel to region
    async function travel(regionName) {
      // Run commmand
      await game.runCommand("travel", { message, args: [regionName], server });

      // Refresh player info
      player = await player.refresh();

      // Get new dropdown menu
      const menu = dropDown(player);
      const row = game.actionRow("menu", menu);

      // Get new embed
      const { embed, title, image } = getEmbed(player);
      const messageRef = await game.fastEmbed({
        player,
        embed,
        title,
        components: [row],
        send: false,
        files: [image],
      });

      // Update message
      await reply.edit(messageRef);
    }
  },
} as Command;

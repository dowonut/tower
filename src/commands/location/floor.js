import floors from "../../game/classes/floors.js";

export default {
  name: "floor",
  aliases: ["f"],
  category: "Location",
  description: "Show information about your current floor.",
  useInCombat: true,
  async execute(message, args, prisma, config, player, game, server) {
    // Create description
    let description = ``;

    // Get player floor information
    let floor = floors[player.floor - 1];

    // Go through regions
    for (const region of floor.regions) {
      // Get region name
      const regionName = `\`${game.titleCase(region.name)}\``;

      // Check if player is at current region and update title
      if (player.region !== region.name) {
        description += `\n${config.emojis.blank}${regionName}`;
      } else {
        description += `\n:round_pushpin:**${regionName}**`;
      }

      // Check if region is peaceful
      // if (!region.enemies) {
      //   description += ` | \`Peaceful\``;
      // }

      // Check if region has activities
      if (region.activities) {
        description += ` | `;
        for (const activity of region.activities) {
          description += `${config.emojis.activities[activity.name]}`;
        }
      }
    }

    description += `\n\nTravel to a new region with \`${server.prefix}travel <region name>\``;

    const title = `Floor ${player.floor} Regions`;
    const embed = {
      description: description,
    };

    //game.sendEmbed(message, embed);
    game.fastEmbed(message, player, embed, title);

    // Unlock the travel command
    player.unlockCommands(message, server, ["travel"]);
  },
};

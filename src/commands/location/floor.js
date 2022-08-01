import floors from "../../game/floors.js";

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
      const regionName = game.titleCase(region.name);

      // Check if player is at current region and update title
      if (player.region !== region.name) {
        description += `\n${regionName}`;
      } else {
        description += `\n**${regionName}**`;
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

    // Create embed
    const embed = {
      title: `${config.emojis.staircase} Floor \`${player.floor}\` Regions`,
      thumbnail: { url: player.pfp },
      color: config.botColor,
      description: description,
      //fields: fields,
    };

    game.sendEmbed(message, embed);

    // Unlock the travel command
    player.unlockCommand(message, server, "travel");
  },
};

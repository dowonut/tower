import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "travel",
  aliases: ["t"],
  arguments: [{ name: "region_name", type: "region" }],
  description: "Travel to a different region on your current floor.",
  category: "location",
  async execute(message, args, player, server) {
    const input = args.region_name;

    // Fetch region data
    const region = game.getRegion(player, input);

    // Get region name
    const regionName = game.titleCase(region.name);

    // Check if player is already in region
    if (player.region == region.name)
      return game.error({
        player,
        content: `you are already at **${regionName}**`,
      });

    // Update player region
    await player.update({ region: region.name, environment: region.environment });

    // Send message
    const botMessage = await game.send({
      player,
      reply: true,
      content: `you traveled to **${regionName}** :map:`,
    });

    // Add explore button
    await game.commandButton({
      player,
      botMessage,
      commands: [{ name: "explore" }],
    });
  },
} as Command;

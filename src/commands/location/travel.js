import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "travel",
  aliases: ["t"],
  arguments: "<region name>",
  description: "Travel to a different region on your floor.",
  category: "location",
  async execute(message, args, player, server) {
    const input = args.join(" ");

    // Check if input
    if (!input)
      return game.error({ message, content: `provide the name of a region.` });

    // Fetch region data
    const region = game.getRegion(player, input);

    // Check if region exists
    if (!region)
      return game.error({
        message,
        content: `not a valid region.
See available regions with \`${server.prefix}floor\``,
      });

    // Get region name
    const regionName = game.titleCase(region.name);

    // Check if player is already in region
    if (player.region == region.name)
      return game.error({
        message,
        content: `you are already at **${regionName}**`,
      });

    // Update player region
    await player.update({ region: region.name });

    // Send message
    const reply = await game.send({
      message,
      reply: true,
      content: `you traveled to **${regionName}** :map:`,
    });

    // Add explore button
    return game.cmdButton(message, reply, ["explore", message, [], server]);
  },
};

export default {
  name: "travel",
  aliases: ["t"],
  arguments: "<region name>",
  description: "Travel to a different region on your floor.",
  category: "Location",
  async execute(message, args, prisma, config, player, game, server) {
    const input = args.join(" ");

    // Check if input
    if (!input) return game.error(message, `provide the name of a region.`);

    // Fetch region data
    const region = game.getRegion(player, input);

    // Check if region exists
    if (!region)
      return game.error(
        message,
        `not a valid region.
See available regions with \`${server.prefix}floor\``
      );

    // Get region name
    const regionName = game.titleCase(region.name);

    // Check if player is already in region
    if (player.region == region.name)
      return game.error(message, `you are already at **${regionName}**`);

    // Update player region
    await player.update({ region: region.name });

    // Send message
    game.reply(message, `you traveled to **${regionName}** :map:`);
  },
};

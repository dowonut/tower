export default {
  name: "region",
  aliases: ["r"],
  arguments: "",
  description: "Get information about your current region.",
  category: "Location",
  useInCombat: true,
  async execute(message, args, prisma, config, player, game, server) {
    const region = player.getRegion();
    const regionName = game.titleCase(region.name);

    const description = `
*${region.description}*`;

    // Create embed fields
    let fields = [];

    // Go through keys
    for (const key in region) {
      if (["enemies", "activities"].includes(key)) {
        let field = {
          name: `**${game.titleCase(key)}:**\n`,
          value: ``,
          inline: true,
        };

        // Add key values
        for (const value of region[key]) {
          let emoji =
            config.emojis[key] && config.emojis[key][value.name.toLowerCase()]
              ? config.emojis[key][value.name.toLowerCase()]
              : ``;

          field.value += `${emoji} \`${game.titleCase(value.name)}\`\n`;
        }

        fields.push(field);
      }
    }

    const title = `${regionName}`;
    const embed = {
      description: description,
      fields: fields,
    };

    game.fastEmbed(message, player, embed, title);
  },
};

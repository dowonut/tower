import floors from "../game/floors.js";

export default {
  name: "floor",
  aliases: ["f"],
  category: "General",
  description: "Show information about your current floor.",
  useInCombat: true,
  async execute(message, args, prisma, config, player, game, server) {
    // Create embed fields
    let fields = [];

    // Get player floor information
    let floor = floors[player.floor - 1];

    // Go through keys
    for (const key in floor) {
      if (["enemies", "activities"].includes(key)) {
        let field = {
          name: `**${game.titleCase(key)}:**\n`,
          value: ``,
          inline: true,
        };

        // Add key values
        for (const value of floor[key]) {
          let emoji = config.emojis[key][value.name.toLowerCase()]
            ? config.emojis[key][value.name.toLowerCase()]
            : ``;
          field.value += `${emoji} \`${value.name}\`\n`;
        }

        fields.push(field);
      }
    }

    // Create embed
    const embed = {
      title: `${config.emojis.staircase} **Floor ${player.floor}**`,
      thumbnail: { url: player.pfp },
      color: config.botColor,
      fields: fields,
    };

    game.sendEmbed(message, embed);
  },
};

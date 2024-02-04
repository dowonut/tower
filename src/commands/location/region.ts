import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "region",
  aliases: ["r", "re"],
  unlockCommands: ["floor", "travel"],
  description: "View information about the current region.",
  category: "location",
  useInCombat: true,
  async execute(message, args, player, server) {
    const region = player.getRegion();
    const regionName = game.titleCase(region.name);
    const regionImage = game.getRegionImage({ name: region.name });

    const description = `
*${region.description}*`;

    // Create embed fields
    let fields = [];
    const explored = await player.getExploration();

    // Go through keys
    for (const key in region) {
      if (["enemies", "activities", "merchants", "loot"].includes(key)) {
        let field = {
          name: `**${game.titleCase(key)}:**\n`,
          value: ``,
          inline: true,
        };

        const exploredArr = explored.map((x) => (x.name ? x.name : x.category));

        // Add key values
        for (const value of region[key]) {
          let name: string = value.name ? value.name : value.category;

          let emoji = "";
          switch (key) {
            case "enemies":
              emoji = config.emojis.enemies[name.replaceAll(" ", "_")] || "";
              break;
            case "loot":
              emoji = config.emojis.items[name.replaceAll(" ", "_")] || "";
              break;
          }

          if (exploredArr.includes(name) || key == "activities") {
            if (key == "merchants") {
              name += ` merchant`;
            }

            field.value += `${emoji} \`${game.titleCase(name)}\`\n`;
          } else {
            field.value += `\`????\`\n`;
          }
        }

        fields.push(field);
      }
    }

    const title = `${regionName}`;
    const embed = {
      description: description,
      fields: fields,
      image: { url: "attachment://region.png" },
    };

    game.fastEmbed({ player, embed, title, files: [regionImage] });
  },
} as Command;

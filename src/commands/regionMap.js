import { regions } from "../game/regions.js";

export default {
  name: "regionmap",
  aliases: ["rm"],
  async execute(message, args, prisma, config, player) {
    const { region: pRegion } = await player.location();
    const regions = await prisma.region.findMany();

    let fields = [];
    for (const region of regions) {
      let regionName;
      if (region.name == pRegion.name) {
        regionName = `:round_pushpin:\`${region.name}\``;
      } else {
        regionName = `\`${region.name}\``;
      }
      fields.push({
        name: regionName,
        value: `
        Min. Level: \`${region.minLevel}\`
        Exploration: \`0%\`
        `,
        inline: false,
      });
    }

    const embed = {
      color: config.embedColor,
      title: `World Map  🗺`,
      fields: fields,
      /*description: `
      ${areaList}
      `,*/
    };

    message.reply({ embeds: [embed] });
  },
};

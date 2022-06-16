export default {
  name: "map",
  aliases: ["m"],
  async execute(message, args, prisma, config, player) {
    const { region, area: pArea } = await player.location();

    let fields = [];
    for (const area of region.areas) {
      let areaName;
      if (area.name == pArea.name) {
        areaName = `:round_pushpin:\`${area.name}\``;
      } else {
        areaName = `${area.name}`;
      }

      const exploration = await player.exploration(area);

      if (exploration) {
        const explorationPercent = await player.explorationPercent(area);

        var info = `Exploration: \`${explorationPercent}\`\n${config.description(
          area
        )}`;
      } else {
        var info = `❔`;
      }

      fields.push({
        name: areaName,
        value: `
        Min. Level: \`${area.minLevel}\`
        ${info}
        `,
        inline: false,
      });
    }

    const embed = {
      color: config.embedColor,
      title: `${region.name}  🗺`,
      fields: fields,
    };

    message.reply({ embeds: [embed] });
  },
};

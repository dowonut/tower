export default {
  name: "profile",
  aliases: ["pr", "p"],
  async execute(message, args, prisma, config, player) {
    if (args[0] && args[0].startsWith("<@")) {
      const user = message.mentions.users.first();

      if (user) {
        player = await player.prisma.player.findUnique({
          where: { discordId: user.id },
        });
      }
    }

    const { region, area } = await player.location();

    const embed = {
      color: config.embedColor,
      title: player.username,
      thumbnail: { url: player.pfp },
      /*fields: [
        { name: "Level:", value: `\`${player.level}\``, inline: true },
        {
          name: "Location:",
          value: `\`${region.name}\``,
          inline: true,
        },
      ],*/
      description: `
      📈 **Level:** \`${player.level}\`

      🍺 **Gold:** \`${player.gold}\`

      :map:  \`${area.name}, ${region.name}\`
      `,
    };

    message.reply({ embeds: [embed] });
  },
};

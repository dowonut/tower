export default {
  name: "profile",
  description: "Show all relevant information about your character.",
  aliases: ["pr", "p"],
  useInCombat: true,
  async execute(message, args, prisma, config, player, game) {
    if (args[0] && args[0].startsWith("<@")) {
      const user = message.mentions.users.first();

      if (user) {
        const playerInfo = await player.prisma.player.findUnique({
          where: { discordId: user.id },
        });

        if (playerInfo) player = playerInfo;
        else return message.channel.send(":x: This user has no character.");
      }
    }

    const embed = {
      color: config.botColor,
      //title: player.username,
      author: {
        name: player.username,
        icon_url: player.pfp,
      },
      //thumbnail: { url: player.pfp },
      description: `
Level: **\`${player.level}\`**
XP: **\`${player.xp} / ${player.xp}\`** ${config.emojis.xp}

Marks: **\`${player.marks}\`** ${config.emojis.mark}
      `,
    };

    game.sendEmbed(message, embed);
  },
};

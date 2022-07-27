export default {
  name: "profile",
  description: "Show all relevant information about your character.",
  aliases: ["pr", "p"],
  category: "Player",
  useInCombat: true,
  async execute(message, args, prisma, config, player, game) {
    // update user info if outdated
    if (
      player.username !== message.author.username ||
      player.discriminator !== message.author.discriminator
    ) {
      await game.updateInfo(message.author, player);
    }

    if (args[0] && args[0].startsWith("<@")) {
      const user = message.mentions.users.first();

      // fetch player data when pinging
      if (user) {
        const playerInfo = await player.prisma.player.findUnique({
          where: { discordId: user.id },
        });

        if (playerInfo) player = playerInfo;
        else return message.channel.send(":x: This user has no character.");
      }
    }

    // format profile embed
    const rawText = `
NAME LEVEL
NAME XP

EMOJI NAME HEALTH

EMOJI NAME STRENGTH
EMOJI NAME DEFENCE

EMOJI NAME MARKS
EMOJI NAME FLOOR`;

    let description = game.description(rawText, player, config);

    if (player.inCombat == true)
      description += `\n:dagger: **Currently in combat.**`;

    const embed = {
      color: config.botColor,
      //title: player.username,
      author: {
        name: player.username + "#" + player.discriminator,
      },
      thumbnail: {
        url: player.pfp,
      },
      //thumbnail: { url: player.pfp },
      description: description,
    };

    game.sendEmbed(message, embed);
  },
};

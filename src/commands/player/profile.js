export default {
  name: "profile",
  description: "Show all relevant information about your character.",
  aliases: ["pr", "p"],
  category: "Player",
  useInCombat: true,
  async execute(message, args, prisma, config, player, game, server) {
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
PROGRESS

EMOJI NAME HEALTH

EMOJI NAME MARKS
EMOJI NAME FLOOR
NAME REGION

EMOJI NAME STRENGTH
EMOJI NAME DEFENCE
EMOJI NAME ARCANE`;

    // Create description
    let description = game.description(rawText, player, config, game);

    // Check if player is currently in combat
    if (player.inCombat == true)
      description += `\n:dagger: **Currently in combat.**\n`;

    // Check if player has unused stat points
    if (player.statpoints > 0)
      description += `\n:low_brightness: **You have \`${player.statpoints}\` unassigned stat points! \n${config.emojis.blank} Check your stats with \`${server.prefix}stats\`**`;

    // Create embed
    const embed = {
      color: config.botColor,
      author: {
        name: player.username + "#" + player.discriminator,
      },
      thumbnail: {
        url: player.pfp,
      },
      description: description,
    };

    game.sendEmbed(message, embed);
  },
};

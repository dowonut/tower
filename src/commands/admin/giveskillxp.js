export default {
  name: "giveskillxp",
  aliases: ["gsx"],
  arguments: "<player> <quantity> <skill>",
  description: "Give xp to a player.",
  category: "Admin",
  async execute(message, args, prisma, config, player, game, server) {
    if (!args[0]) return invalidArguments(message, game);
    if (!args[1]) return invalidArguments(message, game);
    if (!args[2]) return invalidArguments(message, game);

    const quantity = parseInt(args[1]);

    args.shift();
    args.shift();

    const skillName = args.join(" ").toLowerCase();

    const user = message.mentions.users.first();
    const userData = await prisma.player.findUnique({
      where: { discordId: user.id },
    });

    await player.giveSkillXp(quantity, skillName, message, game);

    message.channel.send(
      `Gave **${quantity} XP** to the skill **${skillName}** belonging to **${user.username}**`
    );
  },
};

function invalidArguments(message, game) {
  game.reply(message, `Invalid arguments.`);
}

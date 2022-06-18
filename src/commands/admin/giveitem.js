export default {
  name: "giveitem",
  aliases: ["gi"],
  arguments: "<player> <quantity> <name of item>",
  description: "Give an item to a player.",
  category: "Admin",
  async execute(message, args, prisma, config, player, game, server) {
    if (!args[0]) invalidArguments(message);
    if (!args[1]) invalidArguments(message);
    if (!args[2]) invalidArguments(message);

    const user = message.mentions.users.first();
    const userData = await prisma.player.findUnique({
      where: { discordId: user.id },
    });
    const quantity = parseInt(args[1]);

    args.shift();
    args.shift();

    const itemName = args.join(" ");

    const newItem = await game.giveItem(userData, prisma, itemName, quantity);

    console.log(newItem);

    message.channel.send(
      `Gave **${quantity}x ${newItem.name}** to **${user.username}**`
    );
  },
};

function invalidArguments(message) {
  game.reply(
    message,
    `Invalid arguments. \`${server.prefix}giveitem <player> <quantity> <name of item>\``
  );
}

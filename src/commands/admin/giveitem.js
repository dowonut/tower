export default {
  name: "giveitem",
  aliases: ["gi"],
  arguments: "<player> <quantity> <name of item>",
  description: "Give an item to a player.",
  category: "Admin",
  async execute(message, args, config, player, server) {
    if (!args[0]) return invalidArguments(message, game);
    if (!args[1]) return invalidArguments(message, game);
    if (!args[2]) return invalidArguments(message, game);

    const user = message.mentions.users.first();
    player = await game.getPlayer({
      id: user.id,
      message: message,
      server: server,
    });
    const quantity = parseInt(args[1]);

    args.shift();
    args.shift();

    const itemName = args.join(" ");

    const newItem = await game.giveItem(player, itemName, quantity);

    message.channel.send(
      `Gave **${quantity}x ${newItem.name}** to **${user.username}**`
    );
  },
};

function invalidArguments(message, game) {
  game.reply(message, `Invalid arguments.`);
}

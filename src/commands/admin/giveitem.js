import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "giveitem",
  aliases: ["gi"],
  arguments: "<player> <quantity> <name of item>",
  description: "Give an item to a player.",
  category: "admin",
  async execute(message, args, player, server) {
    if (!args[0]) return invalidArguments(message, game);
    if (!args[1]) return invalidArguments(message, game);
    if (!args[2]) return invalidArguments(message, game);

    const user = message.mentions.users.first();
    player = await game.getPlayer({
      discordId: user.id,
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

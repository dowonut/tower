import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "givemarks",
  aliases: ["gm"],
  arguments: "<player> <quantity>",
  description: "Give marks to a player.",
  category: "admin",
  async execute(message, args, player, server) {
    if (!args[0]) return invalidArguments(message, game);
    if (!args[1]) return invalidArguments(message, game);

    const user = message.mentions.users.first();
    const userData = await prisma.player.findUnique({
      where: { discordId: user.id },
    });
    const quantity = parseInt(args[1]);

    await player.update({ marks: { increment: quantity } });

    game.send({
      message,
      content: `Gave \`${quantity}\`${config.emojis.mark} to **${user.username}**`,
    });
  },
};

function invalidArguments(message, game) {
  game.reply(message, `Invalid arguments.`);
}

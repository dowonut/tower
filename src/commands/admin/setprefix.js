import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "setprefix",
  description: "Change the command prefix for your server.",
  category: "admin",
  arguments: "<new prefix>",
  aliases: ["sp"],
  async execute(message, args, player, server) {
    const prefix = args[0];

    if (!prefix)
      return message.channel.send(
        `Current server prefix: **\`${server.prefix}\`**`
      );

    if (prefix.length > 10)
      return message.channel.send(
        ":x: Prefix can't be longer than 10 letters."
      );

    server = await prisma.server.update({
      where: { serverId: server.serverId },
      data: { prefix: prefix },
    });

    game.send({
      message,
      content: `Server prefix changed to \`${prefix}\``,
      reply: true,
    });
  },
};

import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "setprefix",
  description: "Change the command prefix for your server.",
  category: "admin",
  arguments: [{ name: "new_prefix", required: false }],
  aliases: ["sp"],
  async execute(message, args, player, server) {
    const prefix = args.new_prefix;

    if (!prefix)
      return game.send({
        player,
        reply: true,
        content: `Current server prefix: **\`${server.prefix}\`**`,
      });

    if (prefix.length > 10)
      return game.error({
        player,
        content: "prefix can't be longer than 10 characters.",
      });

    await prisma.server.update({
      where: { serverId: server.serverId },
      data: { prefix: prefix },
    });

    game.send({
      player,
      content: `Server prefix changed to: **\`${prefix}\`**`,
      reply: true,
    });
  },
} as Command;

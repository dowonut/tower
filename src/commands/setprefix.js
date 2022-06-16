export default {
  name: "setprefix",
  aliases: ["sp"],
  async execute(message, args, prisma, config, player, functions, server) {
    const prefix = args[0];

    if (!prefix)
      return message.channel.send(
        `Current server prefix: **\`${server.prefix}\`**`
      );

    if (prefix.length > 10)
      return message.channel.send("Prefix can't be longer than 10 letters.");

    server = await prisma.server.update({
      where: { serverId: server.serverId },
      data: { prefix: prefix },
    });

    console.log(server);

    message.channel.send(`Server prefix changed to \`${prefix}\``);
  },
};

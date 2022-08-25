export default {
  name: "ping",
  arguments: "",
  description: "See bot latency.",
  category: "Admin",
  async execute(message, args, config, player, server) {
    const now = Date.now();

    game.reply(
      message,
      `Latency is \`${now - message.createdTimestamp}ms\``,
      false
    );
  },
};

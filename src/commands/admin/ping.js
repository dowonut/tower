import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "ping",
  arguments: "",
  description: "See bot latency.",
  category: "admin",
  async execute(message, args, player, server) {
    const now = Date.now();

    game.send({
      message,
      content: `Latency is \`${now - message.createdTimestamp}ms\``,
    });
  },
};

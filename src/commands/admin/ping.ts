import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "ping",
  description: "Check bot latency.",
  category: "other",
  async execute(message, args, player, server) {
    const now = Date.now();

    game.send({
      message,
      reply: true,
      content: `Latency is **\`${now - message.createdTimestamp}ms\`**`,
    });
  },
} as Command;

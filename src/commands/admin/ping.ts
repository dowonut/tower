import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "ping",
  description: "Check bot latency.",
  category: "other",
  async execute(message, args, player, server) {
    const msg = await game.send({
      message,
      reply: true,
      content: `WebSocket Ping: \`${client.ws.ping}ms\`\nAPI Endpoint Ping: ...`,
    });

    await msg.edit({
      content: `WebSocket Ping: \`${client.ws.ping}ms\`\nAPI Endpoint Ping: \`${
        msg.createdTimestamp - message.createdTimestamp
      }ms\``,
    });
  },
} as Command;

import { game, prisma } from "../../tower.js";

export default {
  name: "lock",
  description: "Lock the current server.",
  category: "admin",
  dev: true,
  mustUnlock: false,
  cooldown: "5",
  async execute(message, args, player) {
    const server = player.server;
    let content: string;
    if (server.locked) {
      content = `**Server unlocked** 🔓`;
      await prisma.server.update({ where: { id: server.id }, data: { locked: false } });
    } else {
      content = `**Server locked** 🔒`;
      await prisma.server.update({ where: { id: server.id }, data: { locked: true } });
    }
    game.send({ player, content, reply: true });
  },
} satisfies Command;

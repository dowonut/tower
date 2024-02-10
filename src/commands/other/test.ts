import { game, config, prisma, client } from "../../tower.js";

export default {
  name: "test",
  aliases: ["te"],
  description: "For testing purposes.",
  category: "admin",
  dev: true,
  async execute(message, args, player, server) {
    const dungeon = game.get("dungeons", "slime dungeon");
    dungeon.generateInstance();
  },
} as Command;

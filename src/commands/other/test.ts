import { game, config, prisma, client } from "../../tower.js";

export default {
  name: "test",
  aliases: ["te"],
  arguments: "",
  description: "For testing purposes.",
  category: "admin",
  async execute(message, args, player, server) {
    const items = await player.getItems({
      sort: "quantity",
    });
  },
} as Command;

import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "ascend",
  aliases: ["as"],
  description: "Advance to the next floor. Requires 4 key fragments.",
  category: "location",
  async execute(message, args, player, server) {
    game.send({
      message,
      reply: true,
      content: "you don't have all the key fragments to open the door...",
    });
  },
};

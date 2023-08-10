import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "givexp",
  aliases: ["gx"],
  arguments: [
    { name: "user", type: "user" },
    { name: "quantity", type: "strictNumber" },
  ],
  description: "Give xp to a player.",
  category: "admin",
  async execute(message, args, player, server) {
    player = args.user;

    await game.send({
      player,
      content: `Gave **${args.quantity} XP** to ${player.ping}`,
    });

    await player.giveXP({ amount: args.quantity, message });
  },
} as Command;

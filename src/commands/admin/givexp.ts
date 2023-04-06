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
    const toPlayer: Player = args.user;

    await toPlayer.giveXP({ amount: args.quantity, message, server });

    const discordId = toPlayer.user.discordId;
    game.send({
      message,
      content: `Gave **${args.quantity} XP** to <@${discordId}>`,
    });
  },
} as Command;

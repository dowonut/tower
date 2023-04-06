import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "givemarks",
  aliases: ["gm"],
  arguments: [
    { name: "user", type: "user" },
    { name: "quantity", type: "strictNumber" },
  ],
  description: "Give marks to a player.",
  category: "admin",
  async execute(message, args, player, server) {
    if (args.user.marks + args.quantity >= config.integerLimit)
      return game.error({ message, content: `number too large.` });

    await prisma.player.update({
      where: { id: args.user.id },
      data: { marks: { increment: args.quantity } },
    });

    const discordId = args.user.user.discordId;
    game.send({
      message,
      content: `Gave \`${args.quantity}\`${config.emojis.mark} to <@${discordId}>`,
    });
  },
} as Command;

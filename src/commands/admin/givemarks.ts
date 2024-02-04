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
  async execute(message, args: { user: Player; quantity: number }, player, server) {
    if (args.user.marks + args.quantity >= config.integerLimit)
      return game.error({ player, content: `number too large.` });

    await args.user.update({ marks: { increment: args.quantity } });

    const discordId = args.user.user.discordId;
    game.send({
      player,
      content: `Gave \`${args.quantity}\`${config.emojis.mark} to <@${discordId}>`,
    });
  },
} as Command;

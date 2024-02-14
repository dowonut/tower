import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "giveitem",
  aliases: ["gi"],
  arguments: [
    { name: "user", type: "user" },
    { name: "item_name", type: "item" },
    { name: "quantity", required: false, type: "number" },
  ],
  description: "Give an item to a player.",
  category: "admin",
  async execute(message, args, player, server) {
    const toPlayer: Player = args.user;

    await toPlayer.giveItem(args.item_name, args.quantity);

    message.channel.send(
      `Gave \`${args.quantity}x\` **${game.titleCase(args.item_name)}** to <@${
        toPlayer.user.discordId
      }>`
    );
  },
} as Command;

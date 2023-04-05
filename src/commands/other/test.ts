import { game, config, prisma, client } from "../../tower.js";

export default {
  name: "test",
  aliases: ["te"],
  arguments: [
    {
      name: "item_name",
      async filter(i, p, a) {
        const item = await p.getItem(i);
        if (!item) {
          return { success: false, message: `No item :(` };
        } else {
          return { success: true };
        }
      },
    },
    {
      name: "quantity",
      required: false,
      type: "number",
    },
  ],
  description: "For testing purposes.",
  category: "admin",
  async execute(message, args, player, server) {
    const items = await player.getItems({
      sort: "quantity",
    });

    // console.dir(items[0].getEmoji());
  },
} as Command;

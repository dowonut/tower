import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "eat",
  aliases: ["ea"],
  arguments: [
    { name: "item_name", type: "playerOwnedItem" },
    { name: "quantity", type: "number", required: false },
  ],
  description: "Eat food you have in your inventory.",
  category: "item",
  async execute(message, args, player, server) {
    const item = await player.getItem(args.item_name);

    if (item.category !== "food")
      return game.error({ message, content: `this isn't food idiot.` });

    if (args.quantity == "all") {
      let healthRemaining = player.maxHP - player.health;
      let foodRequired = Math.ceil(healthRemaining / item.health);

      args.quantity = foodRequired;
    }

    let heal = item.health * args.quantity;

    if (player.health == player.maxHP)
      return game.error({ message, content: `you're already at max health!` });

    if (player.health + heal > player.maxHP)
      heal = player.maxHP - player.health;

    const playerData = await player.update({ health: { increment: heal } });

    await player.giveItem(item.name, -args.quantity);

    game.send({
      message,
      reply: true,
      content: `Ate \`${
        args.quantity
      }x\` **${item.getName()}** and healed \`${heal}\` points (${
        config.emojis.health
      }\`${playerData.health}/${player.maxHP}\`)`,
    });
  },
} as Command;

import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "eat",
  aliases: ["ea"],
  arguments: [
    { name: "item", type: "playerOwnedItem" },
    { name: "quantity", type: "number", required: false },
  ],
  description: "Eat food you have in your inventory.",
  category: "item",
  async execute(message, args: { item: Item; quantity: number | "all" }, player, server) {
    let { item, quantity } = args;
    const maxHP = player.maxHP;

    if (item.category !== "food") return game.error({ player, content: `this isn't food idiot.` });

    if (quantity == "all") {
      let healthRemaining = maxHP - player.health;
      let foodRequired = Math.ceil(healthRemaining / item.health);

      quantity = foodRequired;
    }

    let heal = item.health * quantity;

    if (player.health == maxHP)
      return game.error({ player, content: `you're already at max health!` });

    if (player.health + heal > maxHP) heal = maxHP - player.health;

    const playerData = await player.update({ health: { increment: heal } });

    await player.giveItem(item.name, -quantity);

    game.send({
      player,
      reply: true,
      content: `Ate \`${quantity}x\` **${item.getName()}** ${item.getEmoji()} and healed \`${heal}\` points (${
        config.emojis.health
      }\`${playerData.health}/${maxHP}\`)`,
    });
  },
} as Command;

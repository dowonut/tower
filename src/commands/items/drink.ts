import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "drink",
  aliases: ["d"],
  arguments: [{ name: "item", type: "playerOwnedItem" }],
  description: "Drink a potion from your inventory.",
  category: "item",
  useInCombat: true,
  async execute(message, args, player, server) {
    const item = await player.getItem(args.item);

    if (item.category !== "potion")
      return game.error({ player, content: `you can't drink this idiot.` });

    // Iterate through item effects
    let effectMessage = ``;
    for (const effect of item.effects) {
      console.log("cool");
    }

    // Remove item
    await player.giveItem(item.name, -1);

    let drinkMessage = `you drank **${item.getName()}** ${item.getEmoji()}`;
    drinkMessage += `${effectMessage}`;

    await game.send({ player, content: drinkMessage, reply: true });
  },
} satisfies Command;

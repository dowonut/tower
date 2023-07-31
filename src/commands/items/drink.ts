import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "drink",
  aliases: ["d"],
  arguments: [{ name: "item", type: "playerOwnedItem" }],
  description: "Drink a potion.",
  category: "item",
  useInCombat: true,
  async execute(message, args, player, server) {
    const item = await player.getItem(args.item);

    if (item.category !== "potion")
      return game.error({ message, content: `you can't drink this idiot.` });

    // Iterate through item effects
    let effectMessage = ``;
    for (const effect of item.effects) {
      // If passive effect
      if (effect.type == "passive") {
        // Add passive effects
        await player.addPassive({
          source: "potion",
          name: effect.filter,
          target: effect.target,
          modifier: effect.modifier,
          value: effect.value,
          duration: effect.duration,
        });
        // Add effect message
        const name = game.titleCase(effect.filter);
        const type = effect.target.toLowerCase();
        const duration = effect.duration;
        let value = `+${effect.value}`;
        if (effect.modifier == "multiply") value += `%`;
        effectMessage += `\n${name} ${type} increased by \`${value}\` for \`${duration}\` rounds`;
      }
      // If health
      else if (effect.type == "health") {
        // Update player health
        await player.update({ health: { increment: effect.value } });
        const healtE = config.emojis.health;
        effectMessage += `\nHealth increased by \`${effect.value}\` ${healtE}`;
      }
    }

    // Remove item
    await player.giveItem(item.name, -1);

    let drinkMessage = `you drank **${item.getName()}** ${item.getEmoji()}`;
    drinkMessage += `${effectMessage}`;

    await game.send({ message, content: drinkMessage, reply: true });
  },
} satisfies Command;

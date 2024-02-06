import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "drink",
  aliases: ["d"],
  arguments: [{ name: "item", type: "playerOwnedItem" }],
  description: "Drink a potion from your inventory.",
  category: "item",
  useInCombat: true,
  async execute(message, args: { item: Item }, player, server) {
    const { item } = args;

    if (item.category !== "potion")
      return game.error({ player, content: `you can't drink this idiot.` });

    // Iterate through item effects
    let effectMessage = ``;
    let statusEffects: StatusEffect[] = [];
    for (const effect of item.effects) {
      const statusEffect = game.getStatusEffect(effect.name);
      statusEffects.push(statusEffect);
    }

    // Apply status effects to player
    await player.applyStatusEffect(...statusEffects);

    // Remove item
    await player.giveItem(item.name, -1);

    let drinkMessage = `You drank **${item.getName()}** ${item.getEmoji()}${effectMessage} and gained \`${statusEffects
      .map((x) => x.getName())
      .join(", ")}\`\n\n${statusEffects.map((x) => x.getInfo(true)).join("\n\n")}`;

    await game.send({ player, content: drinkMessage, reply: true });
  },
} satisfies Command;

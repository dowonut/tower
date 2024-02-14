import emojis from "../../emojis.js";
import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "drink",
  aliases: ["dr"],
  arguments: [{ name: "item", type: "playerOwnedItem" }],
  description: "Drink a potion from your inventory.",
  category: "item",
  useInDungeon: true,
  async execute(message, args: { item: Item }, player, server) {
    const { item } = args;

    if (item.category !== "consumable" || item.consumable.type !== "potion")
      return game.error({ player, content: `you can't drink this idiot.` });

    // Iterate through item effects
    let statusEffects: StatusEffect[] = [];
    const consumableEffects = game.toArray(item.consumable.effects);
    for (const effect of consumableEffects) {
      if (effect.type !== "apply_status_effect") continue;
      const statusEffect = game.getStatusEffect(effect.name);
      statusEffects.push(Object.assign(statusEffect, { level: effect?.level || 0 }));
    }

    // Apply status effects to player
    await player.applyStatusEffect(...statusEffects);

    // Remove item
    await player.giveItem(item.name, -1);

    let drinkMessage = `You drank **${item.getName()}** ${item.getEmoji()} and gained ${statusEffects
      .map((x) => x.displayName)
      .join(", ")}`;

    const botMessage = await game.send({ player, content: drinkMessage, reply: true });

    // Attach info button for status effects
    await game.commandButton({
      botMessage,
      player,
      commands: statusEffects.map((x) => ({
        name: "statuseffectinfo",
        emoji: emojis.question_mark,
        args: [x.name, x.level.toString()],
        label: x.getName(),
      })),
    });
  },
} satisfies Command;

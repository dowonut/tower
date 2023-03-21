import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "equipment",
  aliases: ["eq", "equip"],
  arguments: "<item name>",
  description: "Check your current equipment or equip a new item.",
  category: "player",
  async execute(message, args, player, server) {
    const input = args.join(" ");

    if (!input) {
      // If no arguments provided then give list of equipment
      let description = ``;

      for (const eqSlot of ["hand", "head", "torso", "legs", "feet"]) {
        const item = game.getItem(player[eqSlot]);
        const key = game.titleCase(eqSlot);
        const value = item ? `**${item.getName()}**` : "`         `";
        const emoji = item ? item.getEmoji() : " ";
        description += `\n${key}: ${emoji} ${value}`;

        if (player[eqSlot]) {
          const item = await player.getItem(player[eqSlot]);

          if (item.damage)
            description += ` | \`${item.damage}\`${
              config.emojis.damage[item.damageType]
            }`;
          //description += ` | *${item.description}*`;
        }
      }

      const embed = {
        color: config.botColor,
        thumbnail: { url: player.pfp },
        title: `Equipment`,
        //fields: fields,
        description: description,
      };

      game.send({ message, embeds: [embed] });
    } else {
      // If provided arguments for equipping

      // Check if item exists
      if (!game.getItem(input))
        return game.error({ message, content: "this item doesn't exist." });

      // Fetch item from inventory
      let item = await player.getItem(input);

      // Check if player has item
      if (!item)
        return game.error({ message, content: "you don't have this item." });

      // Check if item is equippable
      if (!item.equipSlot)
        return game.error({ message, content: "you can't equip this silly." });

      // Get currently equipped item
      const equippedItem = await player.getEquipped(item.equipSlot);

      // Unequip item
      if (item.equipped) {
        await player.update({ [item.equipSlot]: null });
        await prisma.inventory.updateMany({
          where: {
            playerId: player.id,
            name: { equals: item.name, mode: "insensitive" },
          },
          data: { equipped: false },
        });

        return game.send({
          message,
          reply: true,
          content: `unequipped **${item.getName()}**`,
        });
      }

      // Equip item
      await player.update({ [item.equipSlot]: item.name.toLowerCase() });
      await prisma.inventory.updateMany({
        where: {
          playerId: player.id,
          name: { equals: item.name, mode: "insensitive" },
        },
        data: { equipped: true },
      });

      // Unequip existing item
      if (equippedItem) {
        await prisma.inventory.updateMany({
          where: {
            playerId: player.id,
            name: { equals: equippedItem.name, mode: "insensitive" },
          },
          data: { equipped: false },
        });

        return game.send({
          message,
          reply: true,
          content: `equipped **${item.getName()}** and unequipped **${equippedItem.getName()}**`,
        });
      }

      return game.send({
        message,
        reply: true,
        content: `equipped **${item.getName()}**`,
      });
    }
  },
};

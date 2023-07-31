import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "equipment",
  aliases: ["eq", "equip"],
  arguments: [{ name: "item", type: "playerOwnedItem", required: false }],
  description: "Check your current equipment or equip a new item.",
  category: "player",
  async execute(message, args, player, server) {
    const item = args.item as Item;

    // If no arguments provided then give list of equipment
    if (!item) {
      let description = ``;

      for (const eqSlot of ["hand", "head", "torso", "legs", "feet"]) {
        const item = await player.getItem(player[eqSlot]);
        const key = game.titleCase(eqSlot);
        const value = item ? `**${item.getName()}**` : "`         `";
        const emoji = item ? item.getEmoji() : " ";
        description += `\n${key}: ${emoji} ${value}`;

        if (player[eqSlot]) {
          if (item.damage)
            description += ` | \`${item.damage}\`${
              config.emojis.damage[item.damageType]
            }`;
          //description += ` | *${item.description}*`;
        }
      }

      const title = `Equipment`;

      game.fastEmbed({ message, title, description, player });
    }

    // Equip / unequip item
    else {
      // If provided arguments for equipping

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
      await player.update({ [item.equipSlot]: item.name });
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
} satisfies Command;

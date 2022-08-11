import items from "../../game/classes/items.js";

export default {
  name: "equipment",
  aliases: ["eq", "equip"],
  arguments: "<item name>",
  description: "Check your current equipment or equip a new item.",
  category: "Player",
  async execute(message, args, prisma, config, player, game, server) {
    const input = args.join(" ");

    if (!input) {
      // If no arguments provided then give list of equipment
      let description = ``;

      for (const eqSlot of ["hand", "head", "torso", "legs", "feet"]) {
        const item = game.getItem(player[eqSlot]);
        const key = game.titleCase(eqSlot);
        const value = player[eqSlot] ? item.getName() : " ";
        description += `\n${key}: \`${value}\``;

        if (player[eqSlot]) {
          const item = await player.getItem(player[eqSlot]);

          if (item.damage)
            description += ` | \`${item.damage}\`${
              config.emojis.damage[item.damageType]
            }`;
          description += ` | *${item.description}*`;
        }
      }

      const embed = {
        color: config.botColor,
        thumbnail: { url: player.pfp },
        title: `Equipment`,
        //fields: fields,
        description:
          description +
          `\n\nEquip an item with \`${server.prefix}equip <item name>\``,
      };

      game.sendEmbed(message, embed);
    } else {
      // If provided arguments for equipping

      // Check if item exists
      if (!game.getItem(input))
        return game.reply(message, "this item doesn't exist.");

      // Fetch item from inventory
      let item = await player.getItem(input);

      // Check if player has item
      if (!item) return game.reply(message, "you don't have this item.");

      // Check if item is equippable
      if (!item.equipSlot)
        return game.reply(message, "you can't equip this silly.");

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

        return game.reply(message, `unequipped **${item.getName()}**`);
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
      return game.reply(message, `equipped **${item.getName()}**`);
    }
  },
};

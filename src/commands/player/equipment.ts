import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "equipment",
  aliases: ["eq", "equip"],
  arguments: [{ name: "item", type: "playerOwnedItem", required: false }],
  description: "View your current equipment or equip a new item.",
  category: "player",
  useInDungeon: true,
  async execute(message, args: { item: Item }, player, server) {
    const { item } = args;

    // If no arguments provided then give list of equipment
    if (!item) {
      let description = ``;

      for (const eqSlot of config.equipSlots) {
        const item = await player.getItem(player[eqSlot]);
        const key = game.titleCase(eqSlot);
        const value = item ? `**${item.getName()}**` : "`              `";
        const emoji = item ? item.getEmoji() : " ";
        description += `\n${key}: ${value} ${emoji}`;

        if (player[eqSlot]) {
          //description += ` | *${item.description}*`;
        }
      }

      const title = `Equipment`;

      game.fastEmbed({ title, description, player });
    }

    // Equip / unequip item
    else {
      let equipData: ItemWeaponData | ItemArmorData;
      if (item.category == "weapon") {
        equipData = item.weapon;
      } else if (item.category == "armor") {
        equipData = item.armor;
      }

      // Check if item is equippable
      if (!equipData.equipSlot)
        return game.error({ player, content: "you can't equip this silly." });

      // Get currently equipped item
      const equippedItem = await player.getEquipped(equipData.equipSlot);

      // Unequip item
      if (item.equipped) {
        await player.update({ [equipData.equipSlot]: null });
        await prisma.inventory.updateMany({
          where: {
            playerId: player.id,
            name: { equals: item.name, mode: "insensitive" },
          },
          data: { equipped: false },
        });

        return game.send({
          player,
          reply: true,
          content: `Unequipped **${item.getName()}** ${item.getEmoji()}`,
        });
      }

      // Equip item
      await player.update({ [equipData.equipSlot]: item.name });
      await prisma.inventory.updateMany({
        where: {
          playerId: player.id,
          name: { equals: item.name, mode: "insensitive" },
        },
        data: { equipped: true },
      });

      // Add item skill
      if (item.category == "weapon") {
        await player.giveSkillXP({ skillName: item.weapon.type + " combat", amount: 0 });
      }

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
          player,
          reply: true,
          content: `Equipped **${item.getName()}** ${item.getEmoji()} and unequipped **${equippedItem.getName()}** ${equippedItem.getEmoji()}`,
        });
      }

      return game.send({
        player,
        reply: true,
        content: `Equipped **${item.getName()}** ${item.getEmoji()}`,
      });
    }
  },
} satisfies Command;

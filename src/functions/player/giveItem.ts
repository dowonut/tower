import { Prisma } from "@prisma/client";
import { prisma, game } from "../../tower.js";

export default (async function (name: string, quantity: number = 1) {
  const item = game.getItem(name);

  // Check if player already has item
  const playerItem = await prisma.inventory.findMany({
    where: {
      playerId: this.id,
      name: { equals: name, mode: "insensitive" },
    },
  });

  // If item already exists, increment
  if (playerItem[0]) {
    // Update existing item
    await prisma.inventory.updateMany({
      where: {
        playerId: this.id,
        name: { equals: name, mode: "insensitive" },
      },
      data: {
        quantity: { increment: quantity },
      },
    });
    // Delete item from database if quantity is 0
    if (playerItem[0].quantity + quantity <= 0) {
      await prisma.inventory.deleteMany({
        where: {
          playerId: this.id,
          name: { equals: name, mode: "insensitive" },
        },
      });
    }
  }
  // Create new item entry
  else {
    // Check if item is recipe
    if (item.category == "recipe") {
      return await this.addRecipe(item.recipe.itemName);
    }

    // Default data
    let data: Prisma.InventoryUncheckedCreateInput = {
      playerId: this.id,
      name: item.name,
      quantity: quantity,
      added: new Date(),
    };

    // Armor data
    if (item.category == "armor") {
      data = {
        ...data,
        level: item.armor?.baseLevel,
        grade: item.armor?.baseGrade,
        materials: item.armor?.baseMaterials,
      };
    }

    // Weapon data
    if (item.category == "weapon") {
      data = {
        ...data,
        level: item.weapon?.baseLevel,
        grade: item.weapon?.baseGrade,
        materials: item.weapon?.baseMaterials,
      };
    }

    // Create new item
    await prisma.inventory.create({
      data,
    });
  }

  // Give new skill
  if (item?.weapon?.type) {
    await this.giveSkillXP({ skillName: item.weapon.type + " combat", amount: 0 });
  }

  const newItem = await this.getItem(item.name);

  return newItem;
} satisfies PlayerFunction);

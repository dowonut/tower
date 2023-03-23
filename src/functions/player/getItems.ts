import * as Prisma from "@prisma/client";
import { ItemClass } from "../../game/classes/items.js";
import { game, prisma } from "../../tower.js";
import items from "../../game/classes/items.js";

type SortOptions = "name" | "quantity" | "damage";

/** Get player items. */
export default (async function (
  args: {
    filter?: (x: Item) => boolean;
    sort?: SortOptions;
  } = {}
) {
  const { sort = "name", filter } = args;

  let itemData: Prisma.Inventory[];

  // Get all items
  itemData = await prisma.inventory.findMany({
    where: { playerId: this.id },
    orderBy: [{ [sort]: "desc" }],
  });

  // Filter items
  if (filter) {
    itemData = itemData.filter(filter);
  }

  // Return if no items
  if (itemData.length < 1 || !itemData[0]) return;

  let finalItems: Item[] = [];

  // Merge with item class
  for (const item of itemData) {
    const itemClass = items.find((x) => x.name == item.name.toLowerCase());

    const finalItem = Object.assign(item, itemClass);

    finalItems.push(finalItem);
  }

  if (finalItems.length == 1) return finalItems[0];

  return finalItems;
} satisfies PlayerFunction);

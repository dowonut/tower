import items from "../../../game/_classes/items.js";
import { game, prisma } from "../../../tower.js";

/**
 * Get an item class instance given a name.
 */
export default function getItem(itemName: string) {
  const item = items.find((x) => x.name == itemName.toLowerCase());

  if (!item) return;

  return item;
}

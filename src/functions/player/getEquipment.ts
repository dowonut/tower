import { game } from "../../tower.js";

const equipmentSlots = ["head", "torso", "legs", "feet", "hand"];

/**
 * Object containing player equipment.
 */
type Equipment = { [key in EquipSlot]?: Item | undefined };

/**
 * Get equipped items.
 */
export default (async function <T extends EquipSlot>(
  this: Player,
  slot?: T
): Promise<T extends undefined ? Equipment : Item> {
  // If specific equipment slot specified
  if (slot) {
    const itemName = this[slot];

    const item = await this.getItem(itemName);

    return item as any;
  }

  // Return object with all equipped items
  else {
    let equipment: Equipment = {};

    // Grab all equipped items and build object
    for (const slot of equipmentSlots) {
      const itemName = this[slot];

      // Undefined if no item
      if (!itemName) {
        equipment[slot] = undefined;
      }
      // If item data
      else {
        const item = await this.getItem(itemName);
        equipment[slot] = item;
      }
    }

    return equipment as any;
  }
} satisfies PlayerFunction);

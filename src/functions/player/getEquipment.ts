import { config, game } from "../../tower.js";

/**
 * Get equipped items.
 */
export default (async function <T extends EquipSlot = undefined>(
  this: Player,
  slot?: T
): Promise<T extends undefined ? PlayerEquipment : Item> {
  // If specific equipment slot specified
  if (slot) {
    const itemName = this[slot];

    const item = await this.getItem(itemName);

    return item as any;
  }

  // Return object with all equipped items
  else {
    let equipment: PlayerEquipment = {};
    const equipmentSlots = config.equipSlots;

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

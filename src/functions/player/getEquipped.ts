import { game, config } from "../../tower.js";

type PlayerEquippedItems = { [key in EquipSlot]: Item | undefined };

/** Get currently equipped items. */
export default (async function <T extends EquipSlot = undefined>(
  equipSlot?: T
): Promise<T extends undefined ? PlayerEquippedItems : Item> {
  // Return item in specific equip slot
  if (equipSlot) {
    return (await getItemInSlot(this, equipSlot)) as any;
  }
  // Return object containing all equip slots
  else {
    let equippedItems: PlayerEquippedItems;

    for (const slot of config.equipSlots) {
      equippedItems[slot] = await getItemInSlot(this, slot);
    }

    return equippedItems as any;
  }

  // Function to get item in current slot
  async function getItemInSlot(player: Player, slot: EquipSlot) {
    if (!player[slot]) return;

    let equipName = player[equipSlot];

    const item = await player.getItem(equipName);

    return item;
  }
} satisfies PlayerFunction);

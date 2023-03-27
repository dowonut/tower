import { ItemClass } from "../../game/_classes/items.ts";
import * as Prisma from "@prisma/client";

declare global {
  /**
   * Item data.
   */
  export type ItemData = {
    name: string;
    category: ItemCategory;
    weaponType?: WeaponType;
    description?: string;
    info: string;
    /** Health regained if consumable. */
    health?: number;
    /** Resell value if sellable. */
    value?: number;
    equipSlot?: EquipSlot;
    /** Base weapon damage. */
    damage?: number;
    /** Base tool sharpness. */
    sharpness?: number;
    damageType?: DamageType;
    /** Effects of item when consumed. */
    effects?: { type: PlayerStats; value: number; info: string }[];
  };

  /**
   * Item base definition.
   */
  export type ItemBase = Prisma.Inventory & ItemData;

  /**
   * Item class.
   */
  export type Item = ItemClass;
}

export {};

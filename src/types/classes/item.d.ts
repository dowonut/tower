import { ItemClass } from "../../game/_classes/items.ts";
import * as Prisma from "@prisma/client";

declare global {
  export type ItemDefaultData<T> = {
    name: string;
    /** Category of the item. */
    category: T; // extends any ? T : ItemCategory;
    /** Short description shown next to item in inventory. */
    description?: string;
    /** Detailed description shown with iteminfo command. */
    info?: string;
    /** Resell value if sellable. */
    value?: number;
  };

  /**
   * Item data.
   */
  export type ItemAllData = {
    /** Health regained if consumable. */
    health: number;
    /** Status effects to apply when the item is consumed. */
    effects: {
      /** Name of status effect to apply. */
      name: StaticStatusEffectName;
      level?: number;
    }[];
    /** Item to unlock when given. */
    recipeItem: string;
    /** Dungeon unlocked by map. */
    dungeon: { name: string };
    /** Weapon type. */
    weaponType: WeaponType;
    /** Which slot the item is equippable to. */
    equipSlot: EquipSlot;
    /** Weapon stats. */
    stats?: WeaponStats;
  };

  /** Weapon specific stats. */
  type WeaponStats = {
    /** Optional base level. Default: 0. */
    baseLevel?: number;
    /** Optional base grade. Default: common. */
    baseGrade?: ItemGrade;
    /** Optional base materials. Default: steel. */
    baseMaterials?: ItemMaterial[];
  };

  /** Item types and properties. */
  export type ItemTypes = {
    // Regular types
    weapon: "weaponType" | "equipSlot" | "stats";
    tool: undefined;
    food: "health";
    crafting: undefined;
    recipe: "recipeItem";
    potion: "effects";
    map: "dungeon";
    test: undefined;
    enhancement: undefined;
    // Combined types
    "weapon/tool": ItemTypes["weapon"] | ItemTypes["tool"];
  };

  /** Dynamic item data type. */
  export type ItemData<T = ItemCategory> = T extends keyof ItemTypes
    ? ItemDefaultData<T> & Pick<ItemAllData, ItemTypes[T]>
    : ItemDefaultData<T>;

  /**
   * Item base definition.
   */
  export type ItemBase = Prisma.Inventory & ItemDefaultData<ItemCategory> & ItemAllData;

  /**
   * Item class.
   */
  export type Item = ItemClass;
}

export {};

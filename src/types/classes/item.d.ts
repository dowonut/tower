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
    /** Type of weapon */
    weaponType: WeaponType;
    /** Health regained if consumable. */
    health: number;
    /** Which slot the item is equippable to. */
    equipSlot: EquipSlot;
    /** Weapon base damage. */
    damage: number;
    /** Base tool sharpness. */
    sharpness: number;
    /** Weapon damage type. */
    damageType: DamageType;
    /** Effects of item when consumed. */
    effects: {
      /** Type of effect. */
      type: PlayerStats | "passive";
      /** What the modifier applies to. */
      filter?: "all" | "sword combat";
      /** What it modifies. */
      target?: "damage" | "crit rate" | "crit damage";
      /** How to apply modifier. */
      modifier?: "multiply" | "add";
      /** Duration in combat rounds. */
      duration?: number;
      /** Modification value. */
      value: number;
      /** Effect info. */
      info: string;
    }[];
    /** Item to unlock when given. */
    recipeItem: string;
    /** Dungeon unlocked by map. */
    dungeon: { name: string };
  };

  /** Item types and properties. */
  export type ItemTypes = {
    // Regular types
    weapon: "weaponType" | "equipSlot" | "damage" | "damageType";
    tool: "sharpness";
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
  export type ItemBase = Prisma.Inventory &
    ItemDefaultData<ItemCategory> &
    ItemAllData;

  /**
   * Item class.
   */
  export type Item = ItemClass;
}

export {};

import { ItemClass } from "../../game/_classes/items.ts";
import * as Prisma from "@prisma/client";

declare global {
  export type ItemDefaultData<T> = {
    name: string;
    /** Category of the item. */
    category: T;
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
    /** Consumable data. */
    consumable: {
      /** Status effects applied by the consumable. */
      effects: ItemConsumableEffect | ItemConsumableEffect[];
      /** The type of consumable. */
      type: "food" | "potion";
    };
    /** Item to unlock when given. */
    recipe: { itemName: string };
    /** Dungeon unlocked by map. */
    dungeon: { name: string };
    /** Weapon data. */
    weapon: ItemWeaponData;
    /** Armor data. */
    armor: ItemArmorData;
    /** XP material data. */
    xpMaterial: {
      /** How much XP it provides. */
      amount: number;
    };
  };

  /** Effect caused by consumable item. */
  type ItemConsumableEffect =
    | {
        type: "apply_status_effect";
        /** Name of status effect to apply. */
        name: StaticStatusEffectName;
        level?: number;
      }
    | {
        type: "heal";
        /** Amount of health to regain. */
        amount: number;
      };

  /** Data for weapon items. */
  export type ItemWeaponData = {
    /** Weapon type. */
    type: WeaponType;
    /** Which slot the weapon is equippable to. */
    equipSlot: EquipSlot;
    /** Optional base level. Default: 0. */
    baseLevel?: number;
    /** Optional base grade. Default: common. */
    baseGrade?: ItemGrade;
    /** Optional base materials. Default: steel. */
    baseMaterials?: ItemMaterial[];
  };

  /** Data for armor items. */
  export type ItemArmorData = {
    /** Which slot the armor is equippable to. */
    equipSlot: EquipSlot;
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
    weapon: "weapon";
    armor: "armor";
    tool: undefined;
    consumable: "consumable";
    crafting: undefined;
    recipe: "recipe";
    map: "dungeon";
    "equipment XP material": "xpMaterial";
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

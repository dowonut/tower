import Prisma from "@prisma/client";

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
   * Tower floor data.
   */
  export type FloorData = {
    /**
     * Regions of the floor.
     */
    regions: RegionData[];
  };

  /**
   * Floor region data.
   */
  export type RegionData = {
    name: string;
    description: string;
    /**
     * Possible enemies.
     */
    enemies?: {
      /**
       * Enemy name.
       */
      name: string;
      /**
       * Weight of enemy spawning.
       */
      weight: number;
    }[];
    /**
     * Possible loot of the region.
     */
    loot?: {
      /**
       * Name of the item.
       */
      name: string;
      /**
       * Weight of finding item.
       */
      weight: number;
      /**
       * Optional minimum.
       */
      min?: number;
      /**
       * Optional maximum.
       */
      max?: number;
    }[];
    /**
     * Possible activities in the region.
     */
    activities?: {
      /**
       * Activity name.
       */
      name: string;
      [key: string]: any;
    }[];
    /**
     * Possible merchants in the region.
     */
    merchants?: {
      category: string;
    }[];
  };

  /**
   * Enemey data.
   */
  export type EnemyData = {
    name: string;
    class: string;
    description: string;
    maxHealth: number;
    level: number;
    attacks: string[];
    strong?: DamageType[];
    weak?: DamageType[];
    loot?: {
      name: string;
      dropChance: number;
      min: number;
      max: number;
    }[];
    shard?: { dropChance: number; type: string };
    xp: number | { min: number; max: number };
  };

  /**
   * Base enemy type.
   */
  export type EnemyBase = EnemyData & Prisma.Enemy;
}

export {};

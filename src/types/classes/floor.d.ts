import { FloorClass } from "../../game/_classes/floors.js";

declare global {
  /**
   * Tower floor data.
   */
  export type FloorData = {
    regions: RegionData[];
  };

  /**
   * Floor region data.
   */
  export type RegionData = {
    name: string;
    /** Aliases for the region. */
    aliases?: string[];
    description: string;
    /** Region enemies. */
    enemies?: {
      /** Enemy name. */
      name: StaticEnemyName;
      /** Weight of enemy spawning. */
      weight: number;
    }[];
    /** Possible loot of the region. */
    loot?: RegionLoot[];
    /** Possible activities in the region. */
    activities?: {
      /** Activity name. */
      name: string;
      [key: string]: any;
    }[];
    /** Possible merchants in the region. */
    merchants?: {
      category: string;
    }[];
    /** Environment type. */
    environment: Environment;
  };

  /**
   * Loot that can be found in a region.
   */
  export type RegionLoot = {
    /** Item name. */
    name: StaticItemName;
    /** Weight of finding item. */
    weight: number;
    min?: number;
    max?: number;
  };

  /**
   * Floor class.
   */
  export type Floor = FloorClass;
}

export {};

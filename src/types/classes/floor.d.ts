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
    description: string;
    /** Region enemies. */
    enemies?: {
      /** Enemy name. */
      name: string;
      /** Weight of enemy spawning. */
      weight: number;
    }[];
    /** Possible loot of the region. */
    loot?: {
      /** Item name. */
      name: string;
      /** Weight of finding item. */
      weight: number;
      min?: number;
      max?: number;
    }[];
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
  };
}

export {};

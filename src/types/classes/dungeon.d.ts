declare global {
  /** Dungeon data. */
  export type DungeonData = {
    name: string;
    description: string;
    /** Possible chambers in the dungeon. */
    chambers: DungeonChamber[];
    /** The boss chamber in the dungeon. */
    bossChamber: DungeonChamberBoss;
    /** DO NOT DEFINE. Generated dungeon instance. */
    instance?: DungeonInstance;
  };

  /** Default data for all dungeon chambers. */
  type DungeonChamberDefault<T> = {
    /** The type of chamber determines the contents. */
    type: T;
    /** Unique ID used to identify the chamber. */
    id: number;
    /** Description for the player. */
    description?: string;
    /** Relative chance of chamber appearing in dungeon. */
    weight: number;
  };

  type DungeonChamberAll = {
    /** Combat chamber. */
    combat: DungeonChamberCombat;
    /** Puzzle chambers. */
    puzzle: {};
    /** Reward chamber. */
    reward: {};
  };

  type DungeonChamberTypes = {
    combat: "combat";
    puzzle: "puzzle";
    reward: "reward";
  };

  /** Boss type dungeon chamber. */
  type DungeonChamberBoss = {
    enemies: StaticEnemyName[];
    effects?: StaticStatusEffectName[];
  };

  /** Combat type dungeon chamber. */
  type DungeonChamberCombat =
    | {
        type: "static";
        enemies: StaticEnemyName[];
        effects?: StaticStatusEffectName[];
      }
    | {
        type: "random";
        enemies: { name: StaticEnemyName; weight: number }[];
        effects?: StaticStatusEffectName[];
      };

  /** Dungeon chamber. */
  type DungeonChamberType = keyof DungeonChamberTypes;

  export type DungeonChamber<T = DungeonChamberType> = T extends keyof DungeonChamberTypes
    ? DungeonChamberDefault<T> & Pick<DungeonChamberAll, DungeonChamberTypes[T]>
    : DungeonChamberDefault<T>;

  /** Generated dungeon instance. */
  export type DungeonInstance = [
    ChamberVertical,
    ChamberVertical,
    ChamberVertical,
    ChamberVertical,
    ChamberVertical,
    ChamberVertical,
    ChamberVertical,
    ChamberVertical
  ];

  type DungeonInstanceChamber = number | 0;

  type ChamberVertical = [
    DungeonInstanceChamber,
    DungeonInstanceChamber,
    DungeonInstanceChamber,
    DungeonInstanceChamber,
    DungeonInstanceChamber
  ];
}
export {};

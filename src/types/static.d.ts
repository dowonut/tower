import { config } from "../tower.js";

declare global {
  /**
   * Weapon/armor equip slots
   */
  export type EquipSlot = (typeof config.equipSlots)[number];

  /**
   * Damage types.
   */
  export type DamageType = (typeof config.damageTypes)[number];

  /**
   * Weapon types.
   */
  export type WeaponType = keyof typeof config.weapons;

  export type PassiveTarget = "";

  /**
   * Item categories.
   */
  export type ItemCategory = keyof ItemTypes;

  /**
   * Categories for Discord commands.
   */
  export type CommandCategory = (typeof config.commandCategories)[number];

  /**
   * Player traits.
   */
  export type PlayerTrait = (typeof config.traits)[number];

  /**
   * Player stats.
   */
  export type PlayerStat = keyof typeof config.baseStats | "SV";

  /**
   * Enemy stats.
   */
  export type EnemyStat = keyof typeof config.baseEnemyStats | "SV";

  /**
   * Extended enemy stats.
   */
  export type EnemyStat_ =
    | keyof typeof config.baseEnemyStats
    | keyof typeof config.baseStatsDamage
    | keyof typeof config.baseStatsResistance
    | "health"
    | "SV";

  /**
   * General stats.
   */
  export type Stat = keyof typeof config.baseStats | "health" | "SV";

  /**
   * Extended stats.
   */
  export type Stat_ =
    | keyof typeof config.baseStats
    | keyof typeof config.baseStatsDamage
    | keyof typeof config.baseStatsResistance
    | "health"
    | "SV";

  /**
   * Weapon stat.
   */
  export type WeaponStat = keyof typeof config.baseWeaponStats;

  /**
   * Enhancement shard types.
   */
  export type ShardType = (typeof config.shardTypes)[number];

  /**
   * Player exploration types.
   */
  export type ExplorationType = "enemy" | "loot" | "merchant" | "dungeon";

  /**
   * Possible argument types for commands.
   */
  export type CommandArgumentType =
    | "number"
    | "numberZero"
    | "strictNumber"
    | "strictNumberZero"
    | "playerSkill"
    | "playerOwnedItem"
    | "playerAvailableMerchant"
    | "playerAvailableAttack"
    | "playerAvailableDungeon"
    | "playerAction"
    | "user"
    | "commandCategory"
    | "item"
    | "region"
    | "target"
    | "statusEffect";

  export type ProgressBarColor = "red" | "green" | "orange" | "white";

  /** Item grades. */
  export type ItemGrade = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythical";

  /** Item material types. */
  export type ItemMaterial = "steel";

  /** Embed colors. */
  export type EmbedColor = keyof typeof config.embedColors;

  /** Colors. */
  export type HEX = `#${string}`;

  /** Environments. */
  export type Environment = "world" | "dungeon" | "protected";

  /** Action target type. */
  export type TargetType = "single" | "adjacent" | "all" | "self";

  /** Action type.*/
  export type ActionType = (typeof config.actionTypes)[number];

  /** Action effect types. */
  export type ActionOutcomeType = (typeof config.ActionOutcomeTypes)[number];
}

export {};

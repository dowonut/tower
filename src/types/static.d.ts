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
  export type WeaponType = (typeof config.weaponTypes)[number];

  /**
   * Player attack types.
   */
  export type AttackType = (typeof config.attackTypes)[number];

  export type PassiveTarget = "";

  /**
   * Item categories.
   */
  export type ItemCategory = keyof ItemTypes;
  // | "weapon"
  // | "food"
  // | "crafting"
  // | "recipe"
  // | "potion"
  // | "map"
  // | "enhancement";

  /**
   * Categories for Discord commands.
   */
  export type CommandCategory = (typeof config.commandCategories)[number];

  /**
   * Player stats.
   */
  export type PlayerStats =
    | "health"
    | "strength"
    | "defence"
    | "arcane"
    | "vitality";

  /**
   * Enhancement shard types.
   */
  export type ShardType = (typeof config.shardTypes)[number];

  /**
   * Player exploration types.
   */
  export type ExplorationType = "enemy" | "loot" | "merchant";

  /**
   * Possible argument types for commands.
   */
  export type CommandArgumentType =
    | "number"
    | "strictNumber"
    | "playerSkill"
    | "playerOwnedItem"
    | "playerAvailableMerchant"
    | "playerAvailableAttack"
    | "user"
    | "commandCategory"
    | "item"
    | "region";

  export type ProgressBarColor = "red" | "green" | "orange" | "white";
}

export {};

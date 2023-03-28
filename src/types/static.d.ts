import { config } from "../tower.ts";

declare global {
  /**
   * Weapon/armor equip slots
   */
  export type EquipSlot = typeof config.equipSlots[number];

  /**
   * Damage types.
   */
  export type DamageType = typeof config.damageTypes[number];

  /**
   * Weapon types.
   */
  export type WeaponType = typeof config.weaponTypes[number];

  /**
   * Player attack types.
   */
  export type AttackType = typeof config.attackTypes[number];

  /**
   * Item categories.
   */
  export type ItemCategory =
    | "weapon"
    | "food"
    | "crafting"
    | "recipe"
    | "potion"
    | "map"
    | "enhancement";

  /**
   * Categories for Discord commands.
   */
  export type CommandCategory =
    | "general"
    | "player"
    | "location"
    | "items"
    | "crafting"
    | "combat"
    | "settings"
    | "other"
    | "admin";

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
  export type ShardType = typeof config.shardTypes[number];

  /**
   * Player exploration types.
   */
  export type ExplorationType = "enemy" | "loot" | "merchant";
}

export {};

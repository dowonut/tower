declare global {
  /**
   * Weapon/armor equip slots
   */
  export type EquipSlot = "head" | "torso" | "legs" | "feet" | "hand";

  /**
   * Damage types.
   */
  export type DamageType =
    | "slashing"
    | "piercing"
    | "bludgeoning"
    | "air"
    | "earth"
    | "fire"
    | "water";

  /**
   * Weapon types.
   */
  export type WeaponType = "sword" | "axe" | "bow" | "spear" | "other";

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
}

export {};

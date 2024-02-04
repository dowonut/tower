declare global {
  type StaticEnemyType = typeof import("../game/enemyTypes/");
  type StaticEnemy = typeof import("../game/enemies/");
  type StaticItem = typeof import("../game/items/");
  type StaticStatusEffect = typeof import("../game/statusEffects/");
  type StaticAction = typeof import("../game/actions/");

  // Enemies
  export type StaticEnemyTypeName = StaticEnemyType[keyof StaticEnemyType]["name"];
  type StaticEnemyActionName = StaticEnemyType[keyof StaticEnemyType]["actions"][number]["name"];
  export type StaticEnemyName = StaticEnemy[keyof StaticEnemy]["name"];

  // Items
  export type StaticItemName = StaticItem[keyof StaticItem]["name"];

  // Status effects
  export type StaticStatusEffectName = StaticStatusEffect[keyof StaticStatusEffect]["name"];

  // Actions
  export type StaticActionName = StaticAction[keyof StaticAction]["name"];
}
export {};

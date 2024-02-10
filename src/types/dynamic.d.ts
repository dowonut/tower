declare global {
  type StaticEnemyType = typeof import("../game/enemyTypes/index.js");
  type StaticEnemy = typeof import("../game/enemies/index.js");
  type StaticItem = typeof import("../game/items/index.js");
  type StaticStatusEffect = typeof import("../game/statusEffects/index.js");
  type StaticAction = typeof import("../game/actions/index.js");
  type StaticDungeon = typeof import("../game/dungeons/index.js");

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

  // Dungeons
  export type StaticDungeonName = StaticDungeon[keyof StaticDungeon]["name"];
}
export {};

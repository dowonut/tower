declare global {
  type StaticEnemy = typeof import("../game/enemyTypes/");

  export type StaticEnemyTypeName = StaticEnemy[keyof StaticEnemy]["name"];
  type StaticEnemyActionName = StaticEnemy[keyof StaticEnemy]["actions"][number]["name"];
}
export {};

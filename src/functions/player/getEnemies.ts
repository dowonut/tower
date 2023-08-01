import enemies from "../../game/_classes/enemies.js";

import { game, prisma } from "../../tower.js";

export default (async function () {
  if (!this.inCombat) return; //throw new Error("Player must be in combat to get enemy.");

  const encounter = this.encounter;
  const enemiesData = encounter.enemies;

  let enemies: Enemy[] = [];
  for (const enemyData of enemiesData) {
    const enemyClass = enemies.find((x) => x.name == enemyData.name);

    const enemy = game.createClassObject<Enemy>(enemyClass, enemyData);
    enemies.push(enemy);
  }

  return enemies;
} satisfies PlayerFunction);

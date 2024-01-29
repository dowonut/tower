import enemies from "../../game/_classes/enemies.js";

import { game, prisma } from "../../tower.js";

export default (async function () {
  if (!this.inCombat) return; //throw new Error("Player must be in combat to get enemy.");

  const encounter = this.encounter;
  const enemiesData = encounter.enemies;

  let finalEnemies: Enemy[] = [];
  for (const enemyData of enemiesData) {
    const enemyClass = enemies.find((x) => x.name == enemyData.name);

    const enemy = game.createClassObject<Enemy>(enemyClass, enemyData);
    finalEnemies.push(enemy);
  }

  console.log(
    "> CURRENT ENCOUNTER ENEMIES: ",
    finalEnemies.map((x) => x.displayName + " " + x.id)
  );
  return finalEnemies;
} satisfies PlayerFunction);

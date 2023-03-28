import enemies from "../../game/_classes/enemies.js";

import { game, prisma } from "../../tower.js";

export default (async function () {
  if (!this.fighting) throw new Error("Player must be in combat to get enemy.");

  const enemyInfo = await prisma.enemy.findUnique({
    where: { id: this.fighting },
  });

  if (!enemyInfo) throw new Error("No enemy found.");

  const enemyClass = enemies.find(
    (x) => x.name == enemyInfo.name.toLowerCase()
  );

  const enemy = game.createClassObject<Enemy>(enemyClass, enemyInfo);

  return enemy;
} satisfies PlayerFunction);

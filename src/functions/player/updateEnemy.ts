import { game, prisma } from "../../tower.js";
import { Prisma } from "@prisma/client";

export default (async function (args: Prisma.EnemyUpdateInput) {
  await prisma.enemy.update({
    where: { id: this.fighting },
    data: args,
  });

  return await this.getEnemy();
} satisfies PlayerFunction);

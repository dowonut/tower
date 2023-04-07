import { game, prisma } from "../../tower.js";

/** Erase all player data. */
export default (async function () {
  await prisma.player.delete({
    where: { id: this.id },
  });
} satisfies PlayerFunction);

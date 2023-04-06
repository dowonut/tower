import { game, prisma } from "../../tower.js";

/** Erase all player data. */
export default (async function () {
  console.log(this.id);
  await prisma.player.delete({
    where: { id: this.id },
  });
} satisfies PlayerFunction);

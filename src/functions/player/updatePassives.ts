import { game, prisma } from "../../tower.js";

/** Update all existing passives. */
export default (async function () {
  const passives = await this.getPassives();

  for (let passive of passives) {
    const { duration } = passive;
    if (duration !== null) {
      passive = await prisma.passive.update({
        where: {
          id: passive.id,
        },
        data: {
          duration: {
            increment: -1,
          },
        },
      });

      if (passive.duration < 1) {
        passive = await prisma.passive.delete({
          where: { id: passive.id },
        });
      }
    }
  }

  return passives;
} satisfies PlayerFunction);

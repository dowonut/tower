import { game, prisma } from "../../tower.js";

/** Get combat encounter. */
export default (async function () {
  if (!this.inCombat) return;

  const encounter = await prisma.encounter.findFirst({
    where: { players: { some: { id: this.id } } },
  });

  return encounter;
} satisfies PlayerFunction);

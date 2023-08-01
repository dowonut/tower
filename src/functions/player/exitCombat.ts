import { game, prisma } from "../../tower.js";

/** Exit combat. */
export default (async function () {
  await this.update({ encounterId: null });
  await prisma.encounter.deleteMany({
    where: { players: { none: {} } },
  });
} satisfies PlayerFunction);

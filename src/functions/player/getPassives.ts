import { Prisma } from "@prisma/client";
import { game, prisma } from "../../tower.js";

/** Get all active passives. */
export default (async function (filter?: Prisma.PassiveWhereInput) {
  // Get all player passives
  const passives = await prisma.passive.findMany({
    where: {
      playerId: this.id,
      ...filter,
    },
  });

  return passives;
} satisfies PlayerFunction);

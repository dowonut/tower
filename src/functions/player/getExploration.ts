import { game, prisma } from "../../tower.js";
import Prisma from "@prisma/client";

type Exploration = Prisma.Exploration;

/**
 * Get player exploration on current floor.
 */
export default (async function (type?: string) {
  let explored: Exploration[];
  if (type) {
    explored = await prisma.exploration.findMany({
      where: {
        playerId: this.id,
        floor: this.floor,
        type: type.toLowerCase(),
      },
    });
  } else {
    explored = await prisma.exploration.findMany({
      where: { playerId: this.id, floor: this.floor },
    });
  }
  return explored;
} as PlayerFunction);

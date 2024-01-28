import { game, prisma } from "../../tower.js";

/** Evaluate the player at the start of the turn. */
export default (async function () {
  // Update attack cooldowns
  await prisma.attack.updateMany({
    where: {
      playerId: this.id,
      remCooldown: { gt: 0 },
    },
    data: { remCooldown: { increment: -1 } },
  });

  return await this.refresh();
} satisfies PlayerFunction);

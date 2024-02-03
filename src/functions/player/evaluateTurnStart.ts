import { game, prisma } from "../../tower.js";

/** Evaluate the player at the start of the turn. */
export default (async function (args: { players: Player[]; enemies: Enemy[] }) {
  const { players = [], enemies = [] } = args;

  // Update attack cooldowns
  await prisma.action.updateMany({
    where: {
      playerId: this.id,
      remCooldown: { gt: 0 },
    },
    data: { remCooldown: { increment: -1 } },
  });

  // Update status effect durations
  await this.update({
    statusEffects: {
      updateMany: {
        where: { remDuration: { gt: 0 } },
        data: { remDuration: { increment: -1 } },
      },
    },
  });
  // Delete status effects with 0 remaining duration
  if (this.statusEffects.some((x) => x?.remDuration < 1)) {
    await this.update({
      statusEffects: {
        deleteMany: {
          id: { in: this.statusEffects.filter((x) => x?.remDuration < 1).map((x) => x.id) },
        },
      },
    });
  }

  // Evaluate status effects
  await this.evaluateStatusEffects({
    currently: "turn_start",
    enemies,
    players,
  });

  return await this.refresh();
} satisfies PlayerFunction);

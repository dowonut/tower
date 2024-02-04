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

  // Evaluate status effects
  await this.evaluateStatusEffects({
    currently: "turn_start",
    enemies,
    players,
  });

  // Update status effect durations and delete expired
  await this.update({
    statusEffects: {
      updateMany: {
        where: { remDuration: { gt: 0 } },
        data: { remDuration: { increment: -1 } },
      },
      deleteMany: {
        remDuration: 0,
      },
    },
  });

  return await this.refresh();
} satisfies PlayerFunction);

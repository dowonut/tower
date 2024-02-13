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

  return await this.refresh();
} satisfies PlayerFunction);

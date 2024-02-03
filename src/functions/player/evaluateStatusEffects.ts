import { game } from "../../tower.js";

/** Evaluate all current status effects. */
export default (async function (args: {
  currently: "turn_end" | "turn_start" | "immediate";
  enemies: Enemy[];
  players: Player[];
}) {
  const { currently, enemies, players } = args;
  const statusEffects = this.getStatusEffects().filter((x) => x.evaluateOn == currently);
  for (const statusEffect of statusEffects) {
    await game.evaluateStatusEffect({ host: this, statusEffect, enemies, players });
  }
} satisfies PlayerFunction);

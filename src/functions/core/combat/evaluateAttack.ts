import { game } from "../../../tower.js";

/** Evaluate the true damage of an attack. */
export default async function evaluateAttack(args: {
  attack: Attack | EnemyAttack;
  source: Enemy | Player;
  target: Enemy | Player;
}) {
  const { attack, source, target } = args;
  let totalDamage = 0;

  // Iterate through damage instances of attack
  for (const damage of attack.damage) {
    // Get base damage
    const baseDamage = Math.floor(source[damage.source] * (damage.basePercent / 100));

    totalDamage += baseDamage;
  }

  return totalDamage;
}

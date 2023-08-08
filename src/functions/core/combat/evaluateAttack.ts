import { game } from "../../../tower.js";

/** Evaluate the true damage of an attack. */
export default async function evaluateAttack(args: {
  attack: Attack | EnemyAttack;
  source: Enemy | Player;
  target: Enemy | Player;
}) {
  const { attack, source, target } = args;
  let flatDamage = 0;

  // Iterate through damage instances of attack
  for (const damage of attack.damage) {
    // Get base damage
    const baseDamage = Math.floor(source[damage.source] * (damage.basePercent / 100));

    flatDamage += baseDamage;
  }

  // Get RES multiplier
  const resMultiplier = 1 - target.RES / (target.RES + 1000);

  const totalDamage = flatDamage * resMultiplier;

  return Math.floor(totalDamage);
}

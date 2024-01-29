import { game } from "../../../tower.js";

/** Evaluate the damage of an action effect against a single target. */
export default function evaluateDamage(args: {
  damageInstances: ActionEffectDamage[];
  source: Enemy | Player;
  target: Enemy | Player;
}) {
  const { damageInstances, source, target } = args;
  const evaluatedDamage: EvaluatedDamage = { instances: [], total: 0 };
  // Iterate through damage instances of attack
  for (const damage of damageInstances) {
    // Define flat damage
    let flatDamage = 0;
    // Get base damage
    const baseDamage = Math.floor(source[damage.source] * (damage.basePercent / 100));
    // Add flat damage sources
    flatDamage += baseDamage;
    // Get RES multiplier
    const resMultiplier = 1 - target.RES / (target.RES + 1000);
    // Calculate multipliers and total damage
    const totalDamage = flatDamage * resMultiplier;
    // Round final damage value down
    const roundedDamage = Math.floor(totalDamage);
    // Add to evaluated damage object
    evaluatedDamage.instances.push({ type: damage.type, total: roundedDamage });
    evaluatedDamage.total += roundedDamage;
  }
  return evaluatedDamage;
}

import { game } from "../../../tower.js";

/** Evaluate a single attack instance against a single target. */
export default async function evaluateDamageInstance(args: { damage: DamageInstance; source: Enemy | Player }) {
  const { damage, source } = args;

  const evaluatedDamageInstance: EvaluatedDamageInstance = { targets: [] };

  // Iterate through targets
  for (const target of damage.targets) {
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
    evaluatedDamageInstance.targets.push({ type: damage.type, total: roundedDamage, target });
  }

  return evaluatedDamageInstance;
}

import PlayerClass from "../../../game/_classes/players.js";
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

    // Define multipliers
    let multipliers = [];

    // Get CRIT multiplier
    let isCrit = false;
    if (source instanceof PlayerClass) {
      isCrit = game.random(1, 100) <= source.CR;
      if (isCrit) multipliers.push(1 + source.CD / 100);
    }

    // Evaluate ACUTE damage
    let isAcute = false;
    let targetResModifier = 1;
    if (source instanceof PlayerClass) {
      isAcute = game.random(1, 100) <= source.AR;
      if (isAcute) targetResModifier = 1 - source.AD / 100;
    }

    // Get RES multiplier
    const resMultiplier =
      1 - (target.RES * targetResModifier) / (target.RES * targetResModifier + 1000);
    multipliers.push(resMultiplier);

    // Calculate multipliers and total damage
    let totalDamage = flatDamage;
    for (const multiplier of multipliers) {
      totalDamage *= multiplier;
    }

    // Round final damage value down
    const roundedDamage = Math.floor(totalDamage);

    // Add to evaluated damage object
    evaluatedDamage.instances.push({
      type: damage.type,
      total: roundedDamage,
      crit: isCrit,
      acute: isAcute,
    });
    evaluatedDamage.total += roundedDamage;
  }
  return evaluatedDamage;
}

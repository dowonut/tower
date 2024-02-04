import PlayerClass from "../../../game/_classes/players.js";
import { game } from "../../../tower.js";

/** Evaluate the damage of an action effect against a single target. */
export default function evaluateDamage(args: {
  damageInstances: ActionOutcomeDamage[] | StatusEffectDamage[];
  /** The entity inflicting the damage. */
  source: Enemy | Player;
  /** The target receiving the damage. */
  target: Enemy | Player;
  /** Can the damage crit and acute. Default = true. */
  canCritandAcute?: boolean;
}) {
  const { damageInstances, source: trueSource, target, canCritandAcute = true } = args;
  const evaluatedDamage: EvaluatedDamage = { instances: [], total: 0 };

  // Iterate through damage instances of attack
  for (const damage of damageInstances) {
    // Define where to draw stats from
    let source: Enemy | Player = trueSource;
    if (damage.statSource == "host" || damage.statSource == "target") {
      source = target;
    }

    // Define flat damage
    let flatDamage = 0;

    // Get base damage
    let baseDamage = 0;
    if (!damage.scaling || damage.scaling == "percent") {
      baseDamage = Math.floor(source[damage.source] * (damage.basePercent / 100));
    } else if (damage.scaling == "flat") {
      baseDamage = Math.floor(damage.baseFlat);
    }

    // Add flat damage sources
    flatDamage += baseDamage;

    // Define multipliers
    let multipliers = [];

    // Get CRIT multiplier
    let isCrit = false;
    if (source instanceof PlayerClass && canCritandAcute) {
      isCrit = game.random(1, 100) <= source.CR;
      if (isCrit) multipliers.push(1 + source.CD / 100);
    }

    // Evaluate ACUTE damage
    let isAcute = false;
    let targetResModifier = 1;
    if (source instanceof PlayerClass && canCritandAcute) {
      isAcute = game.random(1, 100) <= source.AR;
      if (isAcute) targetResModifier = 1 - source.AD / 100;
    }

    // Determined stat to use for scaling resistance
    let resStat: "RES" | "MAG_RES" | "SPC_RES" = "RES";
    switch (damage.source) {
      case "ATK":
        resStat = "RES";
        break;
      case "MAG":
        resStat = "MAG_RES";
        break;
      case "SPC":
        resStat = "SPC_RES";
        break;
    }
    if (damage.resStat) resStat = damage.resStat;

    // Get RES multiplier
    const resMultiplier =
      1 - (target[resStat] * targetResModifier) / (target[resStat] * targetResModifier + 1000);
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

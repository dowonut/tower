import { EnemyClass } from "../../../game/_classes/enemies.js";
import PlayerClass from "../../../game/_classes/players.js";
import { game } from "../../../tower.js";

/** Evaluate an action in combat and return all enemies and players. */
export default async function evaluateAction(args: {
  enemies?: Enemy[];
  players?: Player[];
  source: Enemy | Player;
  target?: Player | Enemy;
  action: Action;
}): Promise<{ enemies?: Enemy[]; players?: Player[] }> {
  let { enemies = [], players = [], source, action, target } = args;

  for (let effect of action.effects) {
    const entities = target instanceof EnemyClass ? enemies : players;
    // Define targets per effect
    if (!effect.targets) effect.targets = [];
    if (!effect.targetType) effect.targetType = "single";
    switch (effect.targetType) {
      // Single target
      case "single":
        effect.targets.push(target);
        break;
      // Adjacent targets
      case "adjacent":
        if (target.number == 1) {
          effect.targets.push(entities.find((x) => x.number == target.number + 1));
        } else if (target.number == entities.length) {
          effect.targets.push(entities.find((x) => x.number == target.number - 1));
        } else {
          effect.targets.push(entities.find((x) => x.number == target.number + 1));
          effect.targets.push(entities.find((x) => x.number == target.number - 1));
        }
        break;
      // All targets
      case "all":
        effect.targets.push(...entities);
        break;
      // Specific targets
      case "choose":
        break;
    }

    switch (effect.type) {
      case "damage":
        await evaluateDamage(effect);
        break;
      case "apply_status":
        break;
      case "custom":
        break;
    }
  }

  return {};

  /** Evaluate effect of type = damage. */
  async function evaluateDamage(effect: ActionEffect<"damage">) {
    const damage = Array.isArray(effect.damage) ? effect.damage : [effect.damage];

    const evaluatedDamage = game.evaluateDamage({
      damageInstances: damage,
      source,
      target: damage,
    });
  }
}

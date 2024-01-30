import _ from "lodash";
import { EnemyClass } from "../../../game/_classes/enemies.js";
import PlayerClass from "../../../game/_classes/players.js";
import { game } from "../../../tower.js";

/** Evaluate an action in combat and return all enemies and players. */
export default async function evaluateAction(args: {
  enemies?: Enemy[];
  players?: Player[];
  source: Enemy | Player;
  target?: Player | Enemy;
  action: Action | EnemyAction;
  /** Don't update sources or targets. Only return information about the action. Default: false. */
  simulate?: boolean;
}) {
  let { enemies = [], players = [], source, action, target, simulate = false } = args;

  let actionTotalDamage = 0;

  // Iterate through action effects
  for (let effect of action.effects) {
    // Remove dead entities from possible targets
    let entities = target instanceof EnemyClass ? enemies : players;
    entities = entities.filter((x) => !x.dead) as PlayerClass[] | EnemyClass[];
    // Define targets per effect
    effect.targets = [];
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
          effect.targets.push(entities.find((x) => x.number < target.number));
          effect.targets.push(entities.find((x) => x.number > target.number));
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
    if (!effect.targets || effect.targets.length < 1) effect.targets = [];

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

  console.log(
    [...enemies, ...players].map(
      (x) => `name: ${x.displayName}. health: ${x.health}. dead: ${x.dead}.`
    )
  );
  return { enemies, players, actionTotalDamage };

  /** Evaluate effect of type = damage. */
  async function evaluateDamage(effect: ActionEffect<"damage">) {
    const damage = Array.isArray(effect.damage) ? effect.damage : [effect.damage];
    for (let target of effect.targets) {
      if (!target) continue;

      // Evaluate damage of effect against target
      const evaluatedDamage = game.evaluateDamage({
        damageInstances: damage,
        source,
        target,
      });
      const totalDamage = evaluatedDamage.total;
      const previousEnemyHealth = target.health;

      // Pass total damage if simulating
      if (simulate) {
        actionTotalDamage += totalDamage;
        continue;
      }

      // Update enemy
      const dead = target.health - totalDamage < 1 ? true : false;
      target = await (target as Player).update({ health: { increment: -totalDamage }, dead });

      // Get attack message
      const message = game.getEffectMessage({
        effect,
        damage: evaluatedDamage,
        source,
        target,
        previousHealth: previousEnemyHealth,
      });

      // Send attack message
      game.emitter.emit("actionMessage", {
        encounterId: source.encounterId,
        message,
      } satisfies ActionMessageEmitter);
    }
    return;
  }
}

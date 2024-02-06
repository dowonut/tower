import _ from "lodash";
import { EnemyClass } from "../../../game/_classes/enemies.js";
import { PlayerClass } from "../../../game/_classes/players.js";
import { game, prisma } from "../../../tower.js";
import { Prisma } from "@prisma/client";
import { setTimeout } from "timers/promises";

/** Evaluate an action in combat and return all enemies and players. */
export default async function evaluateAction(args: {
  enemies?: Enemy[];
  players?: Player[];
  source: Enemy | Player;
  targets?: Targets;
  action: Action | EnemyAction;
  /** Don't update sources or targets. Only return information about the action. Default: false. */
  simulate?: boolean;
}) {
  let { enemies = [], players = [], source, action, targets, simulate = false } = args;
  // Refresh source
  if (!simulate) source = await (source as Player).refresh();

  // Populate empty player and enemy list with source
  if (_.isEmpty(players) && source instanceof PlayerClass) {
    players = [source];
  } else if (_.isEmpty(enemies) && source instanceof EnemyClass) {
    enemies = [source];
  }

  // Track total damage done by action
  let actionTotalDamage = 0;

  // Iterate through action outcomes
  for (let outcome of action.outcomes) {
    // Define target
    const target = targets[outcome.targetNumber || 1] || undefined;
    // Define entities as same as the target
    let entities = target ? (target instanceof EnemyClass ? enemies : players) : enemies;
    // Remove dead entities from possible targets
    entities = entities.filter((x) => !x.dead) as PlayerClass[] | EnemyClass[];
    // Define targets per outcome
    outcome.targets = [];
    if (!outcome.targetType) outcome.targetType = "single";
    switch (outcome.targetType) {
      // Single target
      case "single":
        outcome.targets.push(entities.find((x) => x.number == target.number));
        break;
      // Adjacent targets
      case "adjacent":
        const newTargetLeft = entities
          .sort((a, b) => b.number - a.number)
          .find((x) => x.number < target.number);
        const newTargetRight = entities
          .sort((a, b) => a.number - b.number)
          .find((x) => x.number > target.number);
        if (newTargetLeft) outcome.targets.push(newTargetLeft);
        if (newTargetRight) outcome.targets.push(newTargetRight);
        break;
      // All targets
      case "all":
        outcome.targets.push(...entities);
        break;
      // Self target
      case "self":
        outcome.targets.push(source);
        break;
    }
    // console.log(outcome?.targets?.map((x) => ({ name: x.displayName, health: x.health })));
    switch (outcome.type) {
      case "damage":
        await evaluateDamage(outcome);
        break;
      case "apply_status":
        await applyStatusEffect(outcome);
        break;
      case "custom":
        break;
    }
    // Wait before evaluating next action outcome
    await setTimeout(game.random(2, 5) * 100);
  }

  // Returned with modified entities
  return {
    enemies,
    players,
    actionTotalDamage,
  };

  /** Evaluate damage for outcome. */
  async function evaluateDamage(outcome: ActionOutcome<"damage">) {
    const damage = Array.isArray(outcome.damage) ? outcome.damage : [outcome.damage];
    for (let target of outcome.targets) {
      if (!target) continue;

      // Evaluate damage of outcome against target
      const evaluatedDamage = game.evaluateDamage({
        damageInstances: damage,
        source,
        target,
      });
      const totalDamage = evaluatedDamage.total;
      const previousTargetHealth = target.health;

      // Pass total damage if simulating
      if (simulate) {
        actionTotalDamage += totalDamage;
        continue;
      }

      // Update enemy
      const dead = target.health - totalDamage < 1 ? true : false;
      target = await (target as Player).update({
        health: { increment: -totalDamage },
        dead,
      });

      // Get attack message
      const message = game.getOutcomeMessage({
        outcome,
        damage: evaluatedDamage,
        source,
        target,
        previousHealth: previousTargetHealth,
      });

      // Send attack message
      game.emitter.emit("actionMessage", {
        encounterId: source.encounterId,
        message,
      } satisfies ActionMessageEmitter);
    }
    return;
  }

  /** Apply status effect. */
  async function applyStatusEffect(outcome: ActionOutcome<"apply_status">) {
    if (simulate) return;
    // Get fixed status outcome
    let statusEffect = game.getStatusEffect(outcome.status.name);
    let sourceType: "enemy" | "player";
    if (source instanceof PlayerClass) {
      sourceType = "player";
    } else if (source instanceof EnemyClass) {
      sourceType = "enemy";
    }
    // Define prisma creation data
    let data:
      | Prisma.StatusEffectCreateWithoutPlayerInput
      | Prisma.EnemyStatusEffectCreateWithoutEnemyInput;
    data = {
      name: statusEffect.name,
      remDuration: statusEffect?.duration || null,
      sourceId: source.id,
      sourceType,
    };
    // Iterate through targets
    for (let target of outcome.targets) {
      if (!target) continue;
      // Check if stackable and skip if not
      if (statusEffect.stackable == false) {
        const statusEffects = (target as Player).getStatusEffects();
        if (statusEffects.some((x) => x.name == statusEffect.name)) continue;
      }
      // Create status effect in database
      if (target instanceof PlayerClass) {
        Object.assign(
          statusEffect,
          await prisma.statusEffect.create({ data: { ...data, playerId: target.id } })
        );
      } else if (target instanceof EnemyClass) {
        Object.assign(
          statusEffect,
          await prisma.enemyStatusEffect.create({ data: { ...data, enemyId: target.id } })
        );
      }
      // Get message
      const message = game.getOutcomeMessage({
        outcome,
        source,
        target,
      });
      // Send inflict status effect message
      game.emitter.emit("actionMessage", {
        encounterId: source.encounterId,
        message,
        data: { statusEffect },
      } satisfies ActionMessageEmitter);
      // Immediately evaluate status outcome
      if (statusEffect.evaluateOn == "immediate" || statusEffect.evaluateOn == "passive") {
        await game.evaluateStatusEffect({ host: target, statusEffect, enemies, players });
      }
    }
    return;
  }
}

import { setTimeout } from "timers/promises";
import { config, game, prisma } from "../../../tower.js";

/** Evaluate a status effect against a host. */
export default async function evaluateStatusEffect(args: {
  enemies?: Enemy[];
  players?: Player[];
  source?: Player | Enemy;
  host: Player | Enemy;
  statusEffect: StatusEffect;
}) {
  let { host, statusEffect, players = [], enemies = [], source } = args;

  // Refresh host
  host = await (host as Player).refresh();

  // Determine status effect source
  if (!source && statusEffect.sourceType == "player") {
    source = players.find((x) => x.id == statusEffect.sourceId);
  } else if (!source && statusEffect.sourceType == "enemy") {
    source = enemies.find((x) => x.id == statusEffect.sourceId);
  }

  // Evaluate outcome
  for (const outcome of statusEffect.outcomes) {
    switch (outcome.type) {
      case "damage":
        await evaluateDamage(outcome);
        break;
      case "custom":
        await custom(outcome);
        break;
      case "modify_speed_gauge":
        await modifySpeedGauge(outcome);
        break;
      case "modify_stat":
        await modifyStat(outcome);
        break;
      case "modify_health":
        await modifyHealth(outcome);
        break;
    }
    // Wait before evaluating next effect outcome
    await setTimeout(game.random(2, 5) * 100);
  }

  return;

  // Deal damage to the host
  async function evaluateDamage(outcome: StatusEffectOutcome<"damage">) {
    const damage = Array.isArray(outcome.damage) ? outcome.damage : [outcome.damage];

    // Evaluate damage of effect against target
    const evaluatedDamage = game.evaluateDamage({
      damageInstances: damage,
      source,
      target: host,
      canCritandAcute: false,
    });
    const totalDamage = evaluatedDamage.total;
    const previousHostHealth = host.health;

    // Update host
    const dead = host.health - totalDamage < 1 ? true : false;
    host = await (host as Player).update({
      health: { increment: -totalDamage },
      dead,
    });

    // Get damage message
    const message = game.getOutcomeMessage({
      outcome,
      damage: evaluatedDamage,
      source,
      target: host,
      previousHealth: previousHostHealth,
    });

    // Send message
    emitMessage(source, message);
    return;
  }

  // Evaluate a custom outcome
  async function custom(outcome: StatusEffectOutcome<"custom">) {
    await outcome.evaluate({ source, host });
    return;
  }

  // Modify host's speed gauge
  async function modifySpeedGauge(outcome: StatusEffectOutcome<"modify_speed_gauge">) {
    const currentSG = host.SG;
    let multiplier = 0;
    if (outcome.modifySpeedGauge.type == "forward") {
      multiplier += outcome.modifySpeedGauge.percent / 100;
    } else if (outcome.modifySpeedGauge.type == "delay") {
      multiplier -= outcome.modifySpeedGauge.percent / 100;
    }
    const newSG = currentSG - config.baseSpeedGauge * multiplier;
    host = await (host as Player).update({ SG: newSG });

    // Get attack message
    const message = game.getOutcomeMessage({
      outcome,
      source,
      target: host,
    });

    // Send attack message
    emitMessage(source, message);
    return;
  }

  // Modify stat
  async function modifyStat(outcome: StatusEffectOutcome<"modify_stat">) {
    const modifyStats = Array.isArray(outcome.modifyStat)
      ? outcome.modifyStat
      : [outcome.modifyStat];

    for (const modifyStat of modifyStats) {
      // Check if health is overcapped
      if (modifyStat.stat == "maxHP") {
        if (host.health > host.maxHP) {
          host = await (host as Player).update({ health: host.maxHP });
        }
      }
    }

    // Get message
    const message = game.getOutcomeMessage({
      outcome,
      source,
      target: host,
    });

    // Send attack message
    emitMessage(source, message);
    return;
  }

  // Modify health
  async function modifyHealth(outcome: StatusEffectOutcome<"modify_health">) {
    const modifyHealths = Array.isArray(outcome.modifyHealth)
      ? outcome.modifyHealth
      : [outcome.modifyHealth];

    // Iterate through healing
    let totalHealing = 0;
    const previousHealth = host.health;
    for (const heal of modifyHealths) {
      let statSource: Enemy | Player = source;
      if (heal.statSource == "host") {
        statSource = host;
      }

      let baseHealing = 0;
      if (heal.scaling == "percent") {
        baseHealing = Math.floor(source[heal.scalingStat] * (heal.basePercent / 100));
      } else if (heal.scaling == "flat") {
        baseHealing = Math.floor(heal.baseFlat);
      }

      const roundedHealing = Math.floor(baseHealing);

      totalHealing += roundedHealing;
    }

    // Update health
    const healAmount = Math.min(totalHealing, host.maxHP - host.health);
    host = await (host as Player).update({ health: { increment: healAmount } });

    // Get message
    const message = game.getOutcomeMessage({
      outcome,
      source,
      target: host,
      healAmount,
      previousHealth,
    });

    // Send message
    emitMessage(source, message);
    return;
  }

  function emitMessage(source: Player | Enemy, message: string) {
    if (!source?.encounterId) return;
    game.emitter.emit("actionMessage", {
      encounterId: source.encounterId,
      message,
    } satisfies ActionMessageEmitter);
  }
}

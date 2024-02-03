import { config, game, prisma } from "../../../tower.js";

/** Evaluate a status effect against a host. */
export default async function evaluateStatusEffect(args: {
  enemies: Enemy[];
  players: Player[];
  host: Player | Enemy;
  statusEffect: StatusEffect;
}) {
  let { host, statusEffect, players, enemies } = args;

  // Refresh host
  host = await (host as Player).refresh();

  // Determine status effect source
  let source: Enemy | Player;
  if (statusEffect.sourceType == "player") {
    source = players.find((x) => x.id == statusEffect.sourceId);
  } else if (statusEffect.sourceType == "enemy") {
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
    }
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

    // Send attack message
    game.emitter.emit("actionMessage", {
      encounterId: source.encounterId,
      message,
    } satisfies ActionMessageEmitter);

    return;
  }

  // Evaluate a custom outcome
  async function custom(outcome: StatusEffectOutcome<"custom">) {
    await outcome.evaluate({ host });
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
    game.emitter.emit("actionMessage", {
      encounterId: source.encounterId,
      message,
    } satisfies ActionMessageEmitter);

    return;
  }

  // Modify stat
  async function modifyStat(outcome: StatusEffectOutcome<"modify_stat">) {
    // Check if health is overcapped
    if (outcome.modifyStat.stat == "maxHP") {
      if (host.health > host.maxHP) {
        host = await (host as Player).update({ health: host.maxHP });
      }
    }

    // Get attack message
    const message = game.getOutcomeMessage({
      outcome,
      source,
      target: host,
    });

    // Send attack message
    game.emitter.emit("actionMessage", {
      encounterId: source.encounterId,
      message,
    } satisfies ActionMessageEmitter);
    return;
  }
}

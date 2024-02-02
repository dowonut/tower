import { game } from "../../../tower.js";

/** Evaluate a status effect against a host. */
export default async function evaluateStatusEffect(args: {
  enemies: Enemy[];
  players: Player[];
  host: Player | Enemy;
  statusEffect: StatusEffect;
}) {
  const { host, statusEffect, players, enemies } = args;

  let source: Enemy | Player;
  if (statusEffect.sourceType == "player") {
    source = players.find((x) => x.id == statusEffect.sourceId);
  } else if (statusEffect.sourceType == "enemy") {
    source = enemies.find((x) => x.id == statusEffect.sourceId);
  }
  console.log(
    `> ${source?.displayName} inflicted ${host?.displayName} with ${statusEffect.name} and it is now being evaluated`
  );
}

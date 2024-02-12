import { Prisma } from "@prisma/client";
import { EnemyClass } from "../../../game/_classes/enemies.js";
import PlayerClass from "../../../game/_classes/players.js";
import { game, prisma } from "../../../tower.js";

/** Apply a status effect to an entity. */
export default async function applyStatusEffect(
  name: StaticStatusEffectName,
  target: Enemy | Player,
  source: Enemy | Player | "other"
) {
  // Get fixed status outcome
  let statusEffect = game.getStatusEffect(name);
  let sourceType: "enemy" | "player" | "other";
  if (source instanceof PlayerClass) {
    sourceType = "player";
  } else if (source instanceof EnemyClass) {
    sourceType = "enemy";
  } else {
    sourceType = "other";
  }
  // Define prisma creation data
  let data:
    | Prisma.StatusEffectCreateWithoutPlayerInput
    | Prisma.EnemyStatusEffectCreateWithoutEnemyInput;
  data = {
    name: statusEffect.name,
    remDuration: statusEffect?.duration || null,
    sourceId: source == "other" ? undefined : source.id,
    sourceType,
  };
  // Check if stackable and skip if not
  if (statusEffect.stackable == false) {
    const statusEffects = (target as Player).getStatusEffects();
    if (statusEffects.some((x) => x.name == statusEffect.name)) return;
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
  // Immediately evaluate status outcome
  if (statusEffect.evaluateOn == "immediate" || statusEffect.evaluateOn == "passive") {
    await game.evaluateStatusEffect({ host: target, statusEffect });
  }
  return;
}

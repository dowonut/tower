import { Prisma } from "@prisma/client";
import { game, prisma } from "../../tower.js";

/** Apply one or more status effects to the player. */
export default (async function (...effects: StatusEffect[]) {
  const currentStatusEffects = this.getStatusEffects();
  const sourceType = "player";
  const sourceId = this.id;
  // Iterate through provided status effects
  let createData: Prisma.StatusEffectCreateManyInput[] = [];
  for (let effect of effects) {
    // Check if stackable and skip if not
    if (effect.stackable == false) {
      if (currentStatusEffects.some((x) => x.name == effect.name)) continue;
      if (createData.some((x) => x.name == effect.name)) continue;
    }
    // Create database object
    const data = {
      name: effect.name,
      playerId: this.id,
      sourceId,
      sourceType,
      remDuration: effect?.duration || null,
      level: effect?.level || 0,
    };
    createData.push(data);
    // Add database data to class object
    Object.assign(effect, data);
  }
  // Create status effects in database
  await prisma.statusEffect.createMany({ data: createData });

  // Evaluate immediate
  for (let effect of effects) {
    if (effect.evaluateOn == "immediate") {
      await game.evaluateStatusEffect({ host: this, statusEffect: effect });
    }
  }
} satisfies PlayerFunction);

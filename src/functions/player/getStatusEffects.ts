import statusEffects from "../../game/_classes/statusEffects.js";
import { game, prisma } from "../../tower.js";

/** Get all current status effects. */
export default (function () {
  let finalStatusEffects: StatusEffect[] = [];
  const statusEffectsData = this.statusEffects || [];
  for (const statusEffectData of statusEffectsData) {
    const statusEffectClass = statusEffects.find((x) => x.name == statusEffectData.name);
    const finalStatusEffect = game.createClassObject<StatusEffect>(
      statusEffectClass,
      statusEffectData
    );
    finalStatusEffects.push(finalStatusEffect);
  }
  return finalStatusEffects;
} satisfies PlayerFunction);

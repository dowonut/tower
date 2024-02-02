import { createClassFromType, loadFiles } from "../../functions/core/index.js";
import { game, config } from "../../tower.js";

const StatusEffectBaseClass = createClassFromType<StatusEffectBase>();

export class StatusEffectClass extends StatusEffectBaseClass {
  constructor(object: Generic<StatusEffectBase>) {
    super(object);
  }

  something() {}
}

const statusEffects = await loadFiles<StatusEffectClass>("statusEffects", StatusEffectClass);

export default statusEffects;

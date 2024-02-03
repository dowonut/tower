import { EnemyStatusEffect, Prisma } from "@prisma/client";
import { createClassFromType, loadFiles } from "../../functions/core/index.js";
import { game, config, prisma } from "../../tower.js";

const StatusEffectBaseClass = createClassFromType<StatusEffectBase>();

export class StatusEffectClass extends StatusEffectBaseClass {
  constructor(object: Generic<StatusEffectBase>) {
    super(object);
  }

  /** Refresh the status effect. */
  async refresh(): Promise<StatusEffect> {
    let data;
    if (this.playerId) {
      data = await prisma.statusEffect.findUnique({ where: { id: this.id } });
    } else if (this.enemyId) {
      data = await prisma.enemyStatusEffect.findUnique({ where: { id: this.id } });
    }
    return Object.assign(this, data);
  }

  /** Update the status effect. */
  async update(
    args: Prisma.StatusEffectUpdateInput | Prisma.EnemyStatusEffectUpdateInput
  ): Promise<StatusEffect> {
    let data;
    if (this.playerId) {
      data = await prisma.statusEffect.update({ where: { id: this.id }, data: args });
    } else if (this.enemyId) {
      data = await prisma.enemyStatusEffect.update({ where: { id: this.id }, data: args });
    }
    return Object.assign(this, data);
  }
}

const statusEffects = await loadFiles<StatusEffectClass>("statusEffects", StatusEffectClass);

export default statusEffects;

import { EnemyStatusEffect, Prisma } from "@prisma/client";
import {
  createClassFromType,
  displayNumber,
  f,
  listPrefix,
  toArray,
} from "../../functions/core/index.js";
import { loadFiles } from "../../functions/core/game/loadFiles.js";
import { prisma } from "../../tower.js";
import emojis from "../../emojis.js";
import _ from "lodash";

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

  /** Get status effect emoji. */
  getEmoji() {
    let emoji = "";
    switch (this.type) {
      case "buff":
        break;
      case "debuff":
        break;
    }
    return emoji;
  }

  /** Get advanced info about the status effect. */
  getInfo() {
    let textObject: {
      [key in StatusEffectOutcomeType]: string[];
    } = { damage: [], modify_health: [], modify_speed_gauge: [], modify_stat: [], custom: [] };

    // Determine turn text
    let turnText: string;
    switch (this.evaluateOn) {
      case "immediate":
        turnText = "When applied to an entity, **immediately**";
        break;
      case "turn_end":
        turnText = "When the host's turn **ends**,";
        break;
      case "turn_start":
        turnText = "When the host's turn **begins**,";
        break;
      case "passive":
        turnText = "When applied to an entity, **passively**";
        break;
    }

    const outcomes = this.outcomes;
    for (const [i, outcome] of (outcomes as StatusEffectOutcome[]).entries()) {
      // Determine verb
      let outcomePrefix: string;
      let finalText: string;
      switch (outcome.type) {
        case "damage":
          outcomePrefix = "takes damage equal to";
          break;
        case "modify_health":
          outcomePrefix = "recovers health equal to";
          break;
        case "custom":
        default:
          outcomePrefix = "";
          break;
      }
      // Format suffix and prefix based on index
      let suffix = ``;
      const outComesOfType = this.outcomes.filter((x) => x.type == outcome.type);
      const index = textObject[outcome.type].length;
      if (index > 0 && index !== outComesOfType.length - 1 && outComesOfType.length > 1) {
        outcomePrefix = `,`;
      } else if (index == outComesOfType.length - 1 && outComesOfType.length == 2) {
        outcomePrefix = ` and`;
        suffix = ".";
      } else if (index == outComesOfType.length - 1 && outComesOfType.length > 1) {
        outcomePrefix = `, and`;
        suffix = ".";
      } else if (index == outComesOfType.length - 1) {
        suffix = ".";
      }
      // Determine specific outcome text
      switch (outcome.type) {
        //* Deals damage
        case "damage":
          const damages = toArray(outcome.damage);
          let damageText: string[] = [];
          for (const [i, damage] of damages.entries()) {
            const damageType = `${emojis.damage[damage.type]}**\`${damage.type}\`**`;
            const stat = `${emojis.stats[damage.scalingStat]}**\`${damage.scalingStat}\`**`;
            const statSource = damage?.statSource ? damage.statSource : "source";
            const prefix = listPrefix(i, damages);
            if (!damage.scaling || damage.scaling == "percent") {
              let text = `${prefix}**\`${damage.basePercent}%\`** of the **${statSource}**'s ${stat} as ${damageType}`;
              damageText.push(text);
            } else if (damage.scaling == "flat") {
              let text = `${prefix}**\`${damage.basePercent}\`** as ${damageType}`;
              damageText.push(text);
            }
          }
          finalText = `${outcomePrefix} ${damageText.join("")}${suffix}`;
          break;
        //* Modifies health
        case "modify_health":
          const heals = toArray(outcome.modifyHealth);
          let healText: string[] = [];
          for (const [i, heal] of heals.entries()) {
            const prefix = listPrefix(i, heals);
            const stat = `${emojis.stats[heal.scalingStat]}**\`${heal.scalingStat}\`**`;
            const statSource = heal?.statSource ? heal.statSource : "source";
            if (!heal.scaling || heal.scaling == "percent") {
              let text = `${prefix}**\`${heal.basePercent}%\`** of the **${statSource}**'s ${stat}`;
              healText.push(text);
            } else if (heal.scaling == "flat") {
              let text = `${prefix}**\`${heal.baseFlat}\`**`;
              healText.push(text);
            }
          }
          finalText = `${outcomePrefix} ${healText.join("")}${suffix}`;
          break;
        //* Delays or advances host
        case "modify_speed_gauge":
          const type = outcome.modifySpeedGauge.type + "s";
          const amount = outcome.modifySpeedGauge.percent;
          finalText = `${type} their next action by **\`${amount}%\`**`;
          break;
        //* Modifies the host's stats
        case "modify_stat":
          const stats = toArray(outcome.modifyStat);
          let statText: string[] = [];
          for (const [i, modifyStat] of stats.entries()) {
            let verb: string;
            if (modifyStat?.baseFlat < 0 || modifyStat?.basePercent < 0) {
              verb = "decreases";
            } else {
              verb = "increases";
            }
            const stat = `${emojis.stats[modifyStat.stat]}**\`${modifyStat.stat}\`**`;
            const prefix = listPrefix(i, stats);
            if (!modifyStat.scaling || modifyStat.scaling == "percent") {
              let text = `${prefix}${verb} their ${stat} by **\`${modifyStat.basePercent * 1}%\`**`;
              statText.push(text);
            } else if (modifyStat.scaling == "flat") {
              let text = `${prefix}${verb} their ${stat} by **\`${modifyStat.baseFlat * 1}\`**`;
              statText.push(text);
            }
          }
          finalText = `${outcomePrefix} ${statText.join("")}${suffix}`;
          break;
        //* Has custom effect
        case "custom":
          let customText = _.isFunction(outcome.info) ? outcome.info() : outcome.info;
          finalText = customText + `\n\n`;
          break;
      }
      textObject[outcome.type].push(finalText);
    }
    let finalText = ``;
    const duration = this.duration || undefined;
    if (duration && this.evaluateOn !== "immediate")
      finalText += `⏳ Duration: \`${this.duration} rounds\`\n\n`;
    for (const info of Object.values(textObject)) {
      if (_.isEmpty(info)) continue;
      finalText += `${turnText} ${info.join("")}\n\n`;
    }
    return finalText;
  }
}

const statusEffects = await loadFiles<StatusEffectClass>("statusEffects", StatusEffectClass);

export default statusEffects;

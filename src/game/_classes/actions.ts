import { createClassFromType, f, listPrefix } from "../../functions/core/index.js";
import { loadFiles } from "../../functions/core/game/loadFiles.js";
import { game, config, prisma } from "../../tower.js";
import emojis from "../../emojis.js";
import { Prisma } from "@prisma/client";
import fs from "fs";
import _ from "lodash";

const ActionClassBase = createClassFromType<ActionBase>();

export class ActionClass extends ActionClassBase {
  constructor(object: Generic<ActionBase>) {
    super(object);
  }

  /** Get damage text. */
  getDamageText() {
    let text = ``;
    // if (this.description) damageText += `*${this.description}*\n`;
    // for (const dmg of this.damage) {
    //   text += `${f(dmg.basePercent + "%")} of ${f(dmg.source)} as ${config.emojis.damage[dmg.type]}\n`;
    // }
    // return text;
  }

  /** Get number of required targets. */
  getRequiredTargets() {
    return Math.max(...this.outcomes.map((x) => x.targetNumber || 1));
  }

  /** Get image attachment. */
  getImage() {
    // Create path and check if item image exists
    let path = `./assets/items/placeholder.png`;
    let file: any;

    // Change path for weapons
    if (this.type == "weapon_attack") {
      path = `./assets/icons/weapons/${this.requiredWeapon[0]}.png`;
    }

    // Attach image
    if (fs.existsSync(path)) {
      // Get image file
      file = {
        attachment: path,
        name: `image.png`,
      };
    }

    return file;
  }

  /** Get short damage text for buttons. */
  getBriefDamageText(args: {
    totalEnemies?: number;
    useFormatting?: boolean;
    useEmojis?: boolean;
  }) {
    const { totalEnemies = 1, useFormatting = false, useEmojis = false } = args;
    let text: string[] = [];
    const effects = this.outcomes.filter((x) => x.type == "damage");
    for (const effect of effects as ActionOutcome<"damage">[]) {
      let targetText: string = "";
      // If first target
      switch (effect.targetType) {
        case "single":
          targetText = "|❙|";
          break;
        case "adjacent":
          targetText = "❙|❙";
          break;
        case "all":
          // targetText = "|" + "❙".repeat(totalEnemies || 3) + "|";
          targetText = useFormatting ? "|⋯|" : "|" + "❙".repeat(totalEnemies || 3) + "|";
          break;
        default:
          targetText = "|❙|";
          break;
      }

      // If additional targets
      if (effect?.targetNumber > 1) {
        targetText = "[❙]";
      }

      const damages = Array.isArray(effect.damage) ? effect.damage : [effect.damage];
      for (const [i, damage] of damages.entries()) {
        const emoji = useEmojis ? emojis.damage[damage.type] : "";
        let value: string;
        if (damage.scaling == "percent") {
          value = `${damage.basePercent}%`;
        } else if (damage.scaling == "flat") {
          value = `${damage.baseFlat}`;
        }
        let finalText = useFormatting ? emoji + `**\`${value}\`**` : `${value}`;
        if (i === damages.length - 1) finalText += ` ${targetText}`;
        text.push(finalText);
      }
    }
    return text.join(", ");
  }

  /** Get short damage text for buttons. */
  getInfo() {
    let textObject: {
      [key in ActionOutcomeType]: string[];
    } = { damage: [], apply_status: [], custom: [] };
    const outcomes = this.outcomes;
    for (const [i, outcome] of (outcomes as ActionOutcome[]).entries()) {
      let targetText: string = "";
      // If first target
      switch (outcome.targetType) {
        default:
        case "single":
          targetText = "a single target";
          break;
        case "adjacent":
          targetText = "adjacent targets";
          break;
        case "all":
          targetText = "all targets";
          break;
        case "self":
          targetText = "yourself";
          break;
      }

      // If additional targets
      if (outcome?.targetNumber > 1) {
        targetText = `a ${game.displayNumber(outcome.targetNumber)} target`;
      }

      // Determine prefix
      let outcomePrefix: string;
      let finalText: string;
      switch (outcome.type) {
        case "damage":
          outcomePrefix = "Deals";
          break;
        case "apply_status":
          outcomePrefix = "Applies";
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
        //* Damage
        case "damage":
          const damages = Array.isArray(outcome.damage) ? outcome.damage : [outcome.damage];
          let damageText: string[] = [];
          for (const [i, damage] of damages.entries()) {
            const damageType = `${emojis.damage[damage.type]}**\`${damage.type}\`**`;
            let prefix = listPrefix(i, damages);
            if (damage.scaling == "percent") {
              const stat = `${emojis.stats[damage.scalingStat]}**\`${damage.scalingStat}\`**`;
              const statSource = damage?.statSource ? damage.statSource : "source";
              let text = `${prefix}**\`${damage.basePercent}%\`** of the **${statSource}**'s ${stat} as ${damageType}`;
              damageText.push(text);
            } else if (damage.scaling == "flat") {
              let text = `${prefix}**\`${damage.baseFlat}\`** as ${damageType}`;
              damageText.push(text);
            }
          }
          finalText = `${outcomePrefix} ${damageText.join("")} to **${targetText}**${suffix}`;
          break;
        //* Status effect
        case "apply_status":
          const statusEffect = game.getStatusEffect(outcome.status.name);
          let statusText = `${statusEffect.getEmoji()}**${game.f(outcome.status.name)}**`;
          finalText = `${outcomePrefix} ${statusText} to **${targetText}**${suffix}`;
          break;
        case "custom":
          let customText = _.isFunction(outcome.info) ? outcome.info() : outcome.info;
          finalText = customText + `\n\n`;
          break;
      }
      textObject[outcome.type].push(finalText);
    }
    return textObject;
  }

  /** Get cooldown text. */
  getCooldownText() {
    let text = ``;
    if (this.remCooldown < 1) {
      if (this.cooldown) text += `Cooldown: \`${this.cooldown} rounds\``;
    } else {
      text += `:hourglass: Cooldown: \`${this.remCooldown} rounds\`*`;
    }
    return text;
  }

  /** Get full attack description. */
  getDescription() {
    let text = ``;
    if (this.description) text += `*${this.description}*`;
    const dmgText = this.getDamageText();
    text += `\n${dmgText}`;
    return text;
  }

  /** Get emoji icon. */
  getEmoji() {
    let emoji = ``;
    if (this.type == "weapon_attack") {
      emoji = this.requiredWeapon.map((x) => config.emojis.weapons[x] || "").join(" ");
    }
    if (!emoji) return config.emojis.blank;
    return emoji;
  }

  /** Format attack messages. */
  getMessages(player: Player, enemy: Enemy, damage: EvaluatedDamage) {
    let messages: string[] = [];

    for (const effect of this.outcomes) {
      if (!effect.messages) continue;

      let message = game.getRandom(effect.messages);

      const damageText = damage.instances
        .map((x) => `${emojis.damage[x.type]}${game.f(x.total)}`)
        .join(", ");

      message = message.replaceAll("TARGET", `**${enemy.getName()}**`);
      message = message.replaceAll("DAMAGE", damageText + " damage");
      message = message.replaceAll("SOURCE", `${player.ping}`);

      messages.push(message);
    }

    return messages;
  }

  /** Update attack in database. */
  async update(args: Prisma.ActionUncheckedUpdateInput | Prisma.ActionUpdateInput) {
    const attackInfo = await prisma.action.update({ where: { id: this.id }, data: args });
    return Object.assign(this, attackInfo);
  }

  // Calculate base attack damage
  // async baseDamage() {
  //   let damage: { damages: AttackDamage[]; total?: number } = { damages: [] };
  //   for (const damageInfo of this.damage) {
  //     damage.damages.push({
  //       type: damageInfo.type,
  //       min: damageInfo.min,
  //       max: damageInfo.max,
  //       total: game.random(damageInfo.min, damageInfo.max),
  //     });
  //   }
  //   return damage;
  // }

  // Calculate all damage bonuses
  // async damageBonus(player: Player) {
  //   const item = await player.getEquipped("hand");

  //   if (!item) return 0;

  //   return item.damage;
  // }

  // Calculate damage multipliers
  // async damageMultiplier(player: Player) {
  //   const passives = await player.getPassives({ target: "damage" });

  //   let skillValue = 0;
  //   let potionValue = 0;
  //   for (const passive of passives) {
  //     if (passive.source == "skill") skillValue += passive.value;
  //     if (passive.source == "potion") potionValue += passive.value;
  //   }

  //   const skillMult = skillValue / 100 + 1;

  //   const strengthMult = player.strength / 100 + 1;

  //   const potionMult = potionValue / 100 + 1;

  //   const damageMultiplier =
  //     Math.round(skillMult * strengthMult * potionMult * 10) / 10;

  //   // console.log(`${player.username} ${this.name} damage:`);
  //   // console.log("skill multiplier: ", skillMult);
  //   // console.log("strength multiplier: ", strengthMult);
  //   // console.log("potion multiplier: ", potionMult);
  //   // console.log("total multiplier: ", damageMultiplier);
  //   // console.log("----------------------------");

  //   return damageMultiplier;
  // }

  // /** Get total damage of attack. Enemy is optional. */
  // async getDamage(player: Player, enemy?: Enemy) {
  //   // Base damage
  //   let damage = await this.baseDamage();

  //   // Damage bonus
  //   const damageBonus = await this.damageBonus(player);

  //   // Damage multiplier
  //   const damageMultiplier = await this.damageMultiplier(player);

  //   // Count total damage
  //   let totalDamage = 0;

  //   Damage function
  //   function getDamage(damage, type) {
  //     let finalDamage = Math.floor((damage + damageBonus) * damageMultiplier);

  //     if (!enemy) return finalDamage;

  //     // Calculate enemy strengths and weaknesses
  //     if (enemy.strong.includes(type))
  //       finalDamage = Math.floor(finalDamage - finalDamage * config.strongRate);
  //     if (enemy.weak.includes(type))
  //       finalDamage = Math.floor(finalDamage + finalDamage * config.weakRate);

  //     return finalDamage;
  //   }

  //   // Calculate all types of damage
  //   for (let dmg of damage.damages) {
  //     const damage = getDamage(dmg.total, dmg.type);
  //     const damageMin = getDamage(dmg.min, dmg.type);
  //     const damageMax = getDamage(dmg.max, dmg.type);
  //     dmg.total = damage;
  //     dmg.min = damageMin;
  //     dmg.max = damageMax;
  //     totalDamage += damage;
  //   }
  //   // Set total damage
  //   damage.total = totalDamage;

  //   return damage;
  // }

  /** Format text with damage info. */
  // async damageInfo(player: Player, enemy?: Enemy) {
  //   let text = [];
  //   const damage = await this.getDamage(player, enemy);
  //   for (const dmg of damage.damages) {
  //     let damageText = `${dmg.min} - ${dmg.max}`;
  //     if (dmg.min == dmg.max) damageText = `${dmg.max}`;

  //     text.push(`\`${damageText}\`${config.emojis.damage[dmg.type]}`);
  //   }
  //   return text.join(" ");
  // }
}

const actions = await loadFiles<ActionClass>("actions", ActionClass);

export default actions;

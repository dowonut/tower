import { createClassFromType, loadFiles, f } from "../../functions/core/index.js";
import { game, config, prisma } from "../../tower.js";
import emojis from "../../emojis.js";
import { Prisma } from "@prisma/client";
import fs from "fs";

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
        let finalText = useFormatting
          ? emoji + `**\`${damage.basePercent}%\`**`
          : `${damage.basePercent}%`;
        if (i === damages.length - 1) finalText += ` ${targetText}`;
        text.push(finalText);
      }
    }
    return text.join(", ");
  }

  /** Get short damage text for buttons. */
  getInfo() {
    let text: string[] = [];
    const effects = this.outcomes.filter((x) => x.type == "damage");
    for (const [i, effect] of (effects as ActionOutcome<"damage">[]).entries()) {
      let targetText: string = "";
      // If first target
      switch (effect.targetType) {
        case "single":
          targetText = "a single target";
          break;
        case "adjacent":
          targetText = "adjacent targets";
          break;
        case "all":
          targetText = "all targets";
          break;
        default:
          targetText = "a single target";
          break;
      }

      // If additional targets
      if (effect?.targetNumber > 1) {
        targetText = `a ${game.displayNumber(effect.targetNumber)} target`;
      }

      let damageText: string[] = [];
      const damages = Array.isArray(effect.damage) ? effect.damage : [effect.damage];
      for (const [i, damage] of damages.entries()) {
        const emoji = emojis.damage[damage.type];
        let prefix = ``;
        if (i == damages.length - 1 && damages.length > 1) prefix = `and `;
        let text = `${prefix}**\`${damage.basePercent}%\`** of **\`${damage.source}\`** as ${emoji}`;
        damageText.push(text);
      }
      let prefix = `Deals`;
      let suffix = ``;
      if (i > 0 && i !== this.outcomes.length - 1 && this.outcomes.length > 1) {
        prefix = `,`;
      } else if (i == this.outcomes.length - 1 && this.outcomes.length > 1) {
        prefix = `, and`;
        suffix = ".";
      } else if (i == this.outcomes.length - 1) {
        suffix = ".";
      }
      let finalText = `${prefix} ${damageText.join(", ")} to **${targetText}**${suffix}`;
      text.push(finalText);
    }
    return text.join("");
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

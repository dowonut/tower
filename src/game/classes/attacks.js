import randomFunction from "../../functions/math/random.js";
import randomFunction2 from "../../functions/math/getRandom.js";
import game from "../../functions/format/titleCase.js";
import { emojis } from "../../config.js";
import { loadFiles } from "./_loadFiles.js";
import * as config from "../../config.js";
const random = randomFunction.random;
const getRandom = randomFunction2.getRandom;

class Attack {
  constructor(object) {
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }

    // Get attack name
    this.getName = () => {
      return game.titleCase(this.name);
    };

    // Calculate base attack damage
    this.baseDamage = async () => {
      let damage = { damages: [] };
      for (const damageInfo of this.damage) {
        damage.damages.push({
          type: damageInfo.type,
          min: damageInfo.min,
          max: damageInfo.max,
          total: random(damageInfo.min, damageInfo.max),
        });
      }
      return damage;
    };

    // Calculate all damage bonuses
    this.damageBonus = async (player) => {
      const item = await player.getEquipped("hand");

      if (!item) return 0;

      return item.damage;
    };

    // Calculate damage multipliers
    this.damageMultiplier = async (player) => {
      const passives = await player.getPassives("damage");

      let passiveValue = 0;
      for (const passive of passives) {
        passiveValue += passive.value;
      }

      const passiveMultiplier = passiveValue / 100;

      const strength = player.strength / 100;

      const damageMultiplier = passiveMultiplier + strength + 1;

      return damageMultiplier;
    };

    // Get total damage
    this.getDamage = async (player, enemy) => {
      // Base damage
      let damage = await this.baseDamage();

      // Damage bonus
      const damageBonus = await this.damageBonus(player);

      // Damage multiplier
      const damageMultiplier = await this.damageMultiplier(player);

      // Count total damage
      let totalDamage = 0;

      // Damage function
      function getDamage(damage, type) {
        let finalDamage = Math.floor((damage + damageBonus) * damageMultiplier);

        if (!enemy) return finalDamage;

        // Calculate enemy strengths and weaknesses
        if (enemy.strong.includes(type))
          finalDamage = Math.floor(
            finalDamage - finalDamage * config.strongRate
          );
        if (enemy.weak.includes(type))
          finalDamage = Math.floor(finalDamage + finalDamage * config.weakRate);

        return finalDamage;
      }

      // Calculate all types of damage
      for (let dmg of damage.damages) {
        const damage = getDamage(dmg.total, dmg.type);
        const damageMin = getDamage(dmg.min, dmg.type);
        const damageMax = getDamage(dmg.max, dmg.type);
        dmg.total = damage;
        dmg.min = damageMin;
        dmg.max = damageMax;
        totalDamage += damage;
      }
      // Set total damage
      damage.total = totalDamage;

      return damage;
    };

    // Formats text for damage info
    this.damageInfo = async (player, enemy) => {
      let text = [];
      const damage = await this.getDamage(player, enemy);
      for (const dmg of damage.damages) {
        let damageText = `${dmg.min} - ${dmg.max}`;
        if (dmg.min == dmg.max) damageText = `${dmg.max}`;

        text.push(`\`${damageText}\`${emojis.damage[dmg.type]}`);
      }
      return text.join(" ");
    };

    // Format attack message
    this.attackMessage = (attack, enemy) => {
      if (!this.messages) return undefined;

      let message = getRandom(this.messages);

      const damages = attack.damages.map(
        (x) => `\`${x.total}\`${emojis.damage[x.type]}`
      );
      const damageText = damages.join(" ");

      message = message.replace("ENEMY", `**${enemy.getName()}**`);
      message = message.replace("DAMAGE", damageText + " damage");

      return message;
    };
  }
}

const attacks = await loadFiles("attacks", Attack);

export default attacks;

import { createClassFromType, loadFiles } from "../../functions/core/index.js";
import { game, config } from "../../tower.js";

const AttackClassBase = createClassFromType<AttackBase>();

export class AttackClass extends AttackClassBase {
  constructor(object: Generic<AttackBase>) {
    super(object);
  }

  // Calculate base attack damage
  async baseDamage() {
    let damage: { damages: AttackDamage[]; total?: number } = { damages: [] };
    for (const damageInfo of this.damage) {
      damage.damages.push({
        type: damageInfo.type,
        min: damageInfo.min,
        max: damageInfo.max,
        total: game.random(damageInfo.min, damageInfo.max),
      });
    }
    return damage;
  }

  // Calculate all damage bonuses
  async damageBonus(player: Player) {
    const item = await player.getEquipped("hand");

    if (!item) return 0;

    return item.damage;
  }

  // Calculate damage multipliers
  async damageMultiplier(player: Player) {
    const passives = await player.getPassives({ target: "damage" });

    let skillValue = 0;
    let potionValue = 0;
    for (const passive of passives) {
      if (passive.source == "skill") skillValue += passive.value;
      if (passive.source == "potion") potionValue += passive.value;
    }

    const skillMult = skillValue / 100 + 1;

    const strengthMult = player.strength / 100 + 1;

    const potionMult = potionValue / 100 + 1;

    const damageMultiplier =
      Math.round(skillMult * strengthMult * potionMult * 10) / 10;

    // console.log(`${player.username} ${this.name} damage:`);
    // console.log("skill multiplier: ", skillMult);
    // console.log("strength multiplier: ", strengthMult);
    // console.log("potion multiplier: ", potionMult);
    // console.log("total multiplier: ", damageMultiplier);
    // console.log("----------------------------");

    return damageMultiplier;
  }

  /** Get total damage of attack. Enemy is optional. */
  async getDamage(player: Player, enemy?: Enemy) {
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
        finalDamage = Math.floor(finalDamage - finalDamage * config.strongRate);
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
  }

  /** Format text with damage info. */
  async damageInfo(player: Player, enemy?: Enemy) {
    let text = [];
    const damage = await this.getDamage(player, enemy);
    for (const dmg of damage.damages) {
      let damageText = `${dmg.min} - ${dmg.max}`;
      if (dmg.min == dmg.max) damageText = `${dmg.max}`;

      text.push(`\`${damageText}\`${config.emojis.damage[dmg.type]}`);
    }
    return text.join(" ");
  }

  /** Format attack message. */
  attackMessage(attack: any, enemy: Enemy) {
    if (!this.messages) return undefined;

    let message = game.getRandom(this.messages);

    const damages = attack.damages.map(
      (x) => `\`${x.total}\`${config.emojis.damage[x.type]}`
    );
    const damageText = damages.join(" ");

    message = message.replace("ENEMY", `**${enemy.getName()}**`);
    message = message.replace("DAMAGE", damageText + " damage");

    return message;
  }
}

const attacks = await loadFiles<AttackClass>("attacks", AttackClass);

export default attacks;

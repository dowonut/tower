import {
  createClassFromType,
  loadFiles,
  getRandom,
} from "../../functions/core/index.js";
import { config } from "../../tower.js";
import fs from "fs";

const EnemyBaseClass = createClassFromType<EnemyBase>();

export class EnemyClass extends EnemyBaseClass {
  constructor(enemy: Generic<EnemyBase>) {
    super(enemy);

    // Check if enemy is part of a class
    if (this.class) {
      const object: any = this.class;

      // Set enemy xp based on class xp
      this.xp = {
        min: object.class.xp.min + this.xp,
        max: object.class.xp.max + this.xp,
      };

      // Combine strengths and weaknesses
      this.strong = object.class.strong;
      this.weak = object.class.weak;

      if (object.strong) this.strong = this.strong.concat(object.strong);
      if (object.weak) this.weak = this.weak.concat(object.weak);
    }
  }

  /**
   * Get image.
   */
  getImage() {
    // Format item name
    const enemyName = this.name.split(" ").join("_").toLowerCase();

    // Create path and check if item image exists
    const path = `./assets/enemies/${enemyName}.png`;
    let file = undefined;

    // Attach image
    if (fs.existsSync(path)) {
      // Get image file
      file = {
        attachment: path,
        name: `${enemyName}.png`,
      };
    }

    return file;
  }

  /**
   * Get all attacks.
   */
  getAttacks() {
    if (!this.class) return;
    // Fetch all class attacks available to the enemy
    let attacks = this.class.attacks.filter((x) =>
      this.attacks.includes(x.name)
    );

    // Calculate and map damage of attacks
    attacks = attacks.map((x) => ({
      ...x,
      damage: this.getDamage(x),
    }));

    return attacks;
  }

  /**
   * Calculate best attack against player.
   */
  chooseAttack(player) {
    const attacks = this.getAttacks();

    // Sort by damage descending
    attacks.sort((a, b) => (a.totalMax > b.totalMax ? 1 : -1));

    // Define chosen attack
    let chosenAttack = attacks[0];

    return chosenAttack;
  }

  /**
   * Get attack damage.
   */
  getDamage(input) {
    let attack = { damages: [], totalMin: 0, totalMax: 0 };
    for (const value of input.damage) {
      // Sex values
      let damageMin = value.min;
      let damageMax = value.max;

      // Apply modifiers if present
      let modifier = ``;
      if (value.modifier) {
        modifier = value.modifier.replace("LEVEL", this.class.level);
      }

      // Evaluate modifiers
      damageMin = eval(damageMin + modifier);
      damageMax = eval(damageMax + modifier);

      // Push damages
      attack.damages.push({
        type: value.type,
        min: damageMin,
        max: damageMax,
      });
      attack.totalMin += damageMin;
      attack.totalMax += damageMax;
    }
    return attack;
  }

  /**
   * Format attack message.
   */
  attackMessage(attack, player) {
    if (!attack.messages) return undefined;

    let message = getRandom(attack.messages);

    const damages = attack.damage.damages.map(
      (x) => `\`${x.final}\`${config.emojis.damage[x.type]}`
    );
    const damageText = damages.join(" ");

    message = message.replace("PLAYER", `<@${player.discordId}>`);
    message = message.replace("ENEMY", `**${this.getName()}**`);
    message = message.replace("DAMAGE", damageText + " damage");

    return message;
  }
}

const enemies = await loadFiles<EnemyClass>("enemies", EnemyClass);

export default enemies;

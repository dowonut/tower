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
    if (this.type && typeof this.type !== "string") {
      // Set enemy xp based on class xp
      this.totalXp = {
        min: this.type.xp.min + this.xp,
        max: this.type.xp.max + this.xp,
      };

      // Combine strengths and weaknesses
      if (this.strong) this.strong = this.strong.concat(this.strong);
      if (this.weak) this.weak = this.weak.concat(this.weak);
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

    // Attach image
    if (fs.existsSync(path)) {
      // Get image file
      let file = {
        attachment: path,
        name: `${enemyName}.png`,
      };

      return file;
    }
  }

  /**
   * Get all attacks.
   */
  getAttacks() {
    if (typeof this.type == "string")
      throw new Error("No attacks available on enemy without type.");
    // Fetch all class attacks available to the enemy
    let attacks = this.type.attacks.filter((x) =>
      this.attacks.includes(x.name)
    );

    // Calculate and map damage of attacks
    let finalAttacks = attacks.map((x) => ({
      ...x,
      damage: this.getDamage(x),
    }));

    return finalAttacks;
  }

  /**
   * Calculate best attack against player.
   */
  chooseAttack(player: Player) {
    const attacks = this.getAttacks();

    if (Array.isArray(attacks[0].damage)) return;

    // Sort by damage descending
    attacks.sort((a, b) => (a.damage.totalMax > b.damage.totalMax ? 1 : -1));

    // Define chosen attack
    let chosenAttack = attacks[0];

    return chosenAttack;
  }

  /**
   * Get attack damage.
   */
  getDamage(input: EnemyAttack) {
    let attack = { damages: [], totalMin: 0, totalMax: 0 };
    for (const value of input.damage) {
      // Sex values
      let damageMin = value.min;
      let damageMax = value.max;

      // Apply modifiers if present
      let modifier = ``;
      if (value.modifier) {
        modifier = value.modifier.replace("LEVEL", this.type.level);
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

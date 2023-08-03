import {
  createClassFromType,
  loadFiles,
  getRandom,
} from "../../functions/core/index.js";
import { config } from "../../tower.js";
import fs from "fs";

const EnemyBaseClass = createClassFromType<EnemyBase>();

export class EnemyClass extends EnemyBaseClass {
  // Define defaults
  strong = [];
  weak = [];

  constructor(enemy: Generic<EnemyBase>) {
    super(enemy);

    // Check if enemy belongs to an enemy type
    if (this.type && typeof this.type !== "string") {
      // Set enemy xp based on class xp
      this.totalXp = {
        min: this.type.xp.min + this.xp,
        max: this.type.xp.max + this.xp,
      };

      // Combine strengths and weaknesses
      if (this.type.strong) this.strong = this.strong.concat(this.type.strong);
      if (this.type.weak) this.weak = this.weak.concat(this.type.weak);
    }
    // Throw error if enemy doesn't belong to any type
    else {
      console.log(this);
      throw new Error(
        `Enemy must belong to an enemy type. No enemy type found by name ${this.type} on enemy ${this.name}`
      );
    }
  }

  /** Get enemy image attachment. */
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

  /** Get all attacks. */
  getAttacks(): EnemyEvaluatedAttack[] {
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

  /** Calculate best attack against player. */
  chooseAttack(player: Player) {
    const attacks = this.getAttacks();

    // Sort by damage descending
    attacks.sort((a, b) => (a.damage.max > b.damage.max ? 1 : -1));

    // Define chosen attack
    let chosenAttack = attacks[0];

    return chosenAttack;
  }

  /** Get attack damage. */
  getDamage(input: EnemyAttack) {
    let damage: EnemyAttackEvaluatedDamage = { damages: [], min: 0, max: 0 };
    for (const value of input.damage) {
      // Sex values
      let damageMin = value.min;
      let damageMax = value.max;

      // Apply modifiers if present
      let modifier = ``;
      if (value.modifier) {
        modifier = value.modifier.replace("LEVEL", this.level.toString());
      }

      // Evaluate modifiers
      damageMin = eval(damageMin + modifier);
      damageMax = eval(damageMax + modifier);

      // Push damages
      damage.damages.push({
        type: value.type,
        min: damageMin,
        max: damageMax,
      });
      damage.min += damageMin;
      damage.max += damageMax;
    }
    return damage;
  }

  /** Format attack message. */
  attackMessage(attack: EnemyEvaluatedAttack, player: Player) {
    let message: string;

    // Revert to default message if none found.
    if (!attack.messages) {
      message = config.defaultAttackMessage;
    } else {
      message = getRandom(attack.messages);
    }
    const damages = attack.damage.damages.map(
      (x) => `\`${x.final}\`${config.emojis.damage[x.type]}`
    );
    const damageText = damages.join(" ");

    message = message.replace("PLAYER", `<@${player.user.discordId}>`);
    message = message.replace("ENEMY", `**${this.getName()}**`);
    message = message.replace("DAMAGE", damageText + " damage");

    return message;
  }

  get isPlayer() {
    return false;
  }

  get displayName() {
    return this.getName() + ` (${this.number})`;
  }

  // STATS ---------------------------------------------------------------

  /** Max Health */
  get maxHP() {
    const baseHP = this.baseHP || this.level * 5;
    return baseHP;
  }

  /** Base Speed Value */
  get baseSV() {
    const gauge = config.speedGauge;
    const SV = Math.ceil(gauge / this.SPD);
    return SV;
  }

  /** Attack */
  get ATK() {
    const baseATK = 10;
    return baseATK;
  }

  /** Speed */
  get SPD() {
    const baseSPD = this.baseSPD || 80;
    return baseSPD;
  }
}

const enemies = await loadFiles<EnemyClass>("enemies", EnemyClass);

export default enemies;

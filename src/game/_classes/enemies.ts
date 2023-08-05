import { Prisma } from "@prisma/client";
import {
  createClassFromType,
  loadFiles,
  getRandom,
  getWeightedArray,
  evaluateAttack,
  f,
} from "../../functions/core/index.js";
import { config, prisma } from "../../tower.js";
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

  /** Update enemy in database. */
  async update(args: Prisma.EnemyUncheckedUpdateInput | Prisma.EnemyUpdateInput) {
    const enemyInfo = await prisma.enemy.update({ where: { id: this.id }, data: args });
    return Object.assign(this, enemyInfo);
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

  /** Get all attacks evaluated. */
  async getAttacks(player: Player, evaluated: boolean = true) {
    // Fetch all class attacks available to the enemy
    let attacks = this.type.attacks.filter((x) => this.attacks.includes(x.name));

    let evaluatedAttacks: EvaluatedEnemyAttack[] = [];

    for (const attack of attacks) {
      const damage = await evaluateAttack({ attack, source: this, target: player });
      evaluatedAttacks.push({ ...attack, damage });
    }

    return evaluatedAttacks;
  }

  /** Calculate best attack against player. */
  async getBestAttack(player: Player) {
    const attacks = await this.getAttacks(player);

    // Sort by damage descending
    attacks.sort((a, b) => (a.damage > b.damage ? 1 : -1));

    // Define chosen attack
    let chosenAttack = attacks[0];

    return chosenAttack;
  }

  /** Format attack message. */
  getAttackMessage(attack: EvaluatedEnemyAttack, player: Player) {
    if (!attack.messages) return undefined;

    let message = getRandom(attack.messages);

    const damageText = f(attack.damage);

    message = message.replaceAll("ENEMY", `**${this.getName()}**`);
    message = message.replaceAll("DAMAGE", damageText + " damage");
    message = message.replaceAll("PLAYER", `<@${player.user.discordId}>`);

    return message;
  }

  /** Get a target to attack. */
  getTargetPlayer(players: Player[]) {
    // Filter by alive
    players = players.filter((x) => !x.dead);

    // Choose weighted random from aggro
    const chosen: { player: Player; weight: number } = getWeightedArray(
      players.map((x) => {
        return { player: x, weight: x.AGR };
      })
    );
    return chosen.player;
  }

  get isPlayer() {
    return false;
  }

  get displayName() {
    return this.getName() + ` (${this.number})`;
  }

  // STATS ---------------------------------------------------------------

  /** Base Speed Value */
  get baseSV() {
    const gauge = config.speedGauge;
    const SV = Math.ceil(gauge / this.SPD);
    return SV;
  }

  /** Max Health */
  get maxHP() {
    const baseHP = this.baseHP || this.level * 5;
    return baseHP;
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

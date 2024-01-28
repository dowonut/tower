import { Prisma } from "@prisma/client";
import {
  createClassFromType,
  loadFiles,
  getRandom,
  getWeightedArray,
  evaluateAttack,
  f,
  random,
} from "../../functions/core/index.js";
import { config, prisma, game } from "../../tower.js";
import emojis from "../../emojis.js";
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

  /** Refresh the enemy with info from the database. */
  async refresh() {
    const enemyInfo = await prisma.enemy.findUnique({ where: { id: this.id } });
    return Object.assign(this, enemyInfo);
  }

  /** Get enemy image attachment. */
  getImageAttachment() {
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

  /** Get the path for the enemy image. */
  getImagePath() {
    // Format file name
    const enemyName = this.name.split(" ").join("_").toLowerCase();

    // Create path and check if item image exists
    const path = `./assets/enemies/${enemyName}.png`;

    if (!fs.existsSync(path)) {
      return `./assets/enemies/placeholder.png`;
    } else {
      return path;
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
    attacks.sort((a, b) => (a.damage.total > b.damage.total ? 1 : -1));

    // Define chosen attack
    let chosenAttack = attacks[0];

    return chosenAttack;
  }

  /** Format attack message. */
  getAttackMessage(attack: EvaluatedEnemyAttack, player: Player) {
    if (!attack.messages) return undefined;

    let message = getRandom(attack.messages);

    const damageText = attack.damage.instances.map((x) => `${emojis.damage[x.type]}${game.f(x.total)}`).join(", ");

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

  /** Evaluate the enemy at the start of the turn. */
  async evaluateTurnStart() {
    return await this.refresh();
  }

  get isPlayer() {
    return false;
  }

  get displayName() {
    return this.getName() + ` (${this.number})`;
  }

  // STATS =======================================================================

  /** Get a specific evaluated stat. */
  getStat(stat: EnemyStat) {
    const baseStat = this?.stats?.["base_" + stat] || this.type?.stats?.["base_" + stat] || config.baseEnemyStats[stat];

    // Get flat bonus from level
    const levelBonusFunction = config["enemy_" + stat];
    const levelBonus = levelBonusFunction ? levelBonusFunction(this.level, this.type?.isBoss) : 0;

    const total = baseStat + levelBonus;

    return total;
  }

  /** Base Speed Value */
  get baseSV() {
    const gauge = config.speedGauge;
    const SV = Math.ceil(gauge / this.SPD);
    return SV;
  }

  /** XP dropped by enemy. */
  get XP() {
    const baseXP = this.getStat("XP");
    const min = Math.floor(baseXP * 0.9);
    const max = Math.floor(baseXP * 1.1);
    const finalXP = random(min, max);
    return finalXP;
  }

  /** Max Health */
  get maxHP() {
    return this.getStat("maxHP");
  }

  /** Attack */
  get ATK() {
    return this.getStat("ATK");
  }

  /** Magic */
  get MAG() {
    return this.getStat("MAG");
  }

  /** Physical Resistance */
  get RES() {
    return this.getStat("RES");
  }

  /** Magic Resistance */
  get MAG_RES() {
    return this.getStat("MAG_RES");
  }

  /** Speed */
  get SPD() {
    return this.getStat("SPD");
  }
}

const enemies = await loadFiles<EnemyClass>("enemies", EnemyClass);

export default enemies;

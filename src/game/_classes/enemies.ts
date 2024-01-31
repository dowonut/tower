import { Prisma } from "@prisma/client";
import _ from "lodash";
import {
  createClassFromType,
  loadFiles,
  getRandom,
  getWeightedArray,
  evaluateDamage,
  f,
  random,
  evaluateAction,
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
      throw new Error(
        `Enemy must belong to an enemy type. No enemy type found by name ${this.type} on enemy ${this.name}`
      );
    }
  }

  /** Update enemy in database. */
  async update(args: Prisma.EnemyUncheckedUpdateInput | Prisma.EnemyUpdateInput) {
    const enemyInfo = await prisma.enemy.update({
      where: { id: this.id },
      data: args,
      include: {},
    });
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

  /** Get an action. */
  async getAction(actionName: string) {
    actionName = actionName.toLowerCase();
    const actionData = await prisma.enemyAction.findUnique({
      where: {
        enemyId_name: {
          enemyId: this.id,
          name: actionName,
        },
      },
    });

    if (!actionData) return;

    const actionClass = this.type.actions.find((x) => x.name == actionName);

    if (!actionClass) return;

    const finalAction: EnemyAction = Object.assign(_.cloneDeep(actionData), actionClass);
    return finalAction;
  }

  /** Get all actions available to the enemy. */
  async getActions<T extends boolean = false>(args: {
    player: Player;
    players: Player[];
    evaluated: T;
  }): Promise<T extends true ? EvaluatedAction[] : ActionData[]> {
    const { player, players, evaluated = false } = args;

    // Fetch all class attacks available to the enemy
    let actions = this.type.actions.filter((x) => this.actions.includes(x.name));

    if (!evaluated) return actions as any;

    let evaluatedActions: EvaluatedAction[] = [];

    // Iterate through all available actions and evaluate
    for (const action of actions) {
      let finalAction = await this.getAction(action.name);

      // Create action if it doesn't exist yet
      if (!finalAction) {
        await prisma.enemyAction.create({
          data: { enemyId: this.id, name: action.name },
        });
        finalAction = await this.getAction(action.name);
      }

      const { actionTotalDamage } = await evaluateAction({
        source: this,
        targets: { 1: player },
        players,
        action: finalAction,
        simulate: true,
      });
      evaluatedActions.push({ ...finalAction, totalDamage: actionTotalDamage });
    }

    return evaluatedActions as any;
  }

  /** Calculate strongest action against a player. */
  async getStrongestAction(args: { player: Player; players: Player[] }) {
    const { player, players } = args;

    let attacks = await this.getActions({ player, players, evaluated: true });
    // console.log(attacks.map((x) => x.name + " " + x.totalDamage));

    // Sort by damage descending
    attacks = _.orderBy(attacks, ["totalDamage"], "desc");

    // Define chosen attack
    let chosenAttack = attacks[0];

    return chosenAttack;
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
    // Update attack cooldowns
    await prisma.enemyAction.updateMany({
      where: {
        enemyId: this.id,
        remCooldown: { gt: 0 },
      },
      data: { remCooldown: { increment: -1 } },
    });

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
    const baseStat =
      this?.stats?.["base_" + stat] ||
      this.type?.stats?.["base_" + stat] ||
      config.baseEnemyStats[stat];

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

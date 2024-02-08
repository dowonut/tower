import { Prisma } from "@prisma/client";
import _ from "lodash";
import {
  createClassFromType,
  getRandom,
  getWeightedArray,
  evaluateDamage,
  f,
  random,
  evaluateAction,
  createClassObject,
  evaluateStatusEffect,
  titleCase,
} from "../../functions/core/index.js";
import { config, prisma } from "../../tower.js";
import emojis from "../../emojis.js";
import fs from "fs";
import { statusEffects } from "./index.js";
import { loadFiles } from "../../functions/core/game/loadFiles.js";

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
      include: config.enemyInclude,
    });
    return Object.assign(this, enemyInfo);
  }

  /** Refresh the enemy with info from the database. */
  async refresh() {
    const enemyInfo = await prisma.enemy.findUnique({
      where: { id: this.id },
      include: config.enemyInclude,
    });
    return Object.assign(this, enemyInfo);
  }

  /** Get emoji. */
  getEmoji(): string {
    const emojiName = this.name.replaceAll(" ", "_").toLowerCase();

    let emoji = config.emojis.enemies[emojiName];

    if (!emoji) emoji = "";

    return emoji;
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
        name: `enemy.png`,
      };
      return file;
    }
    // Return with placeholder image
    else {
      let file = {
        attachment: `./assets/enemies/placeholder.png`,
        name: `enemy.png`,
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

  /** Get current status effects. */
  getStatusEffects() {
    let finalStatusEffects: StatusEffect[] = [];
    const statusEffectsData = this.statusEffects || [];
    for (const statusEffectData of statusEffectsData) {
      const statusEffectClass = statusEffects.find((x) => x.name == statusEffectData.name);
      const finalStatusEffect = createClassObject<StatusEffect>(
        statusEffectClass,
        statusEffectData
      );
      finalStatusEffects.push(finalStatusEffect);
    }
    return finalStatusEffects;
  }

  /** Evaluate all status effects. */
  async evaluateStatusEffects(args: {
    currently: "turn_end" | "turn_start" | "immediate";
    enemies: Enemy[];
    players: Player[];
  }) {
    const { currently, enemies, players } = args;
    const statusEffects = this.getStatusEffects().filter((x) => x.evaluateOn == currently);
    for (const statusEffect of statusEffects) {
      await evaluateStatusEffect({ host: this, statusEffect, enemies, players });
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
    let actions = this.type.actions.filter((x) =>
      this.actions.includes(x.name as StaticEnemyActionName)
    );

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

  // INFO =======================================================================

  /** Get info text for enemy stats. */
  getStatsInfo() {
    let text = ``;
    for (let statName of Object.keys(config.baseEnemyStats) as EnemyStat[]) {
      if (statName == "XP") continue;
      let name: string = statName;
      if (statName == "maxHP") name = "Max HP";
      let percent = ``;
      if (["CR", "CD", "AR", "AD"].includes(name)) percent = `%`;
      const statText = f(this.getStat(statName).toString() + percent);
      text += `${emojis.stats[statName]} ${titleCase(name)}: ${statText}\n`;
    }
    return text;
  }

  // STATS =======================================================================

  /** Get a specific evaluated stat. */
  getStat(stat: EnemyStat) {
    // Get status effects
    const statusEffects = this.getStatusEffects();

    // ---------------------------------------
    // Define flat bonus
    let flatBonus = 0;

    // Get base stat
    let baseStat = 0;
    switch (stat) {
      case "SV":
        baseStat = Math.floor(this.SG / this.SPD);
        break;
      default:
        baseStat =
          this?.stats?.["base_" + stat] ||
          this.type?.stats?.["base_" + stat] ||
          config.baseEnemyStats[stat];
        break;
    }
    flatBonus += baseStat;

    // Get flat bonus from level
    const levelBonusFunction = config["enemy_" + stat];
    const levelBonus = levelBonusFunction ? levelBonusFunction(this.level) : 0;
    flatBonus += levelBonus;

    // ---------------------------------------
    // Define multipliers
    let multipliers = {
      statusEffects: 1,
    };

    // Evaluate status effects
    for (const statusEffect of statusEffects) {
      // Iterate through effect outomes
      for (const outcome of statusEffect.outcomes) {
        // Modify stat
        if (outcome.type == "modify_stat") {
          const modifyStats = Array.isArray(outcome.modifyStat)
            ? outcome.modifyStat
            : [outcome.modifyStat];

          // Iterate through stat modifications
          for (const modifyStat of modifyStats) {
            if (modifyStat.scaling == "percent") {
              multipliers.statusEffects += modifyStat.basePercent / 100;
            } else if (modifyStat.scaling == "flat") {
              flatBonus += modifyStat.baseFlat;
            }
          }
        }
      }
    }

    // ---------------------------------------
    // Evaluate multipliers
    let totalBeforeMultipliers = flatBonus;
    let total = totalBeforeMultipliers;
    for (const [key, multiplier] of Object.entries(multipliers)) {
      total *= multiplier;
    }

    return Math.max(0, Math.floor(total));
  }

  /** Base Speed Value */
  get SV() {
    return this.getStat("SV");
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
  /** Special */
  get SPC() {
    return this.getStat("SPC");
  }
  /** Physical Resistance */
  get RES() {
    return this.getStat("RES");
  }
  /** Magic Resistance */
  get MAG_RES() {
    return this.getStat("MAG_RES");
  }
  /** Special Resistance */
  get SPC_RES() {
    return this.getStat("SPC_RES");
  }
  /** Speed */
  get SPD() {
    return this.getStat("SPD");
  }
}

const enemies = await loadFiles<EnemyClass>("enemies", EnemyClass);

export default enemies;

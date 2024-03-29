import { createClassFromType, getTurnOrder, toArray } from "../../functions/core/index.js";
import { config } from "../../tower.js";

const PlayerBaseClass = createClassFromType<PlayerBase, false>();

export class PlayerClass extends PlayerBaseClass {
  constructor(player: PlayerBase) {
    super(player);

    Object.defineProperty(this, "testget", {
      get() {
        return "hello";
      },
    });
  }

  /** Get number in party */
  get number() {
    return this?.party?.players.findIndex((p) => p.id == this.id) + 1 || 1;
  }

  /** Currently in combat? */
  get inCombat() {
    return this.encounterId ? true : false;
  }

  /** Discord ping text. */
  get ping() {
    return `<@${this.user.discordId}>`;
  }

  /** Is leader of the current party. */
  get isPartyLeader() {
    return this.party && this.id == this.party.leader;
  }

  /** Get username. */
  get displayName() {
    return this.user.username;
  }

  get isPlayer() {
    return true;
  }

  /** Can currently take an action. */
  get canTakeAction() {
    if (!this.encounter) return false;
    return this.encounter.currentPlayer == this.id;
  }

  /** Get currently active Discord channel. */
  getChannel() {
    return this.channel || this.message.channel;
  }

  /** Check if the player is the author of the message attached to them. */
  get isMessageAuthor() {
    return this.message && this?.message?.author.id == this.user.discordId;
  }

  // STATS =================================================================

  /** Get a specific evaluated stat. */
  getStat<T extends boolean = false>(
    stat: Stat_,
    verbose?: T
  ): T extends false
    ? number
    : {
        [key in
          | "base"
          | "flatBonus"
          | "weaponLevelBonus"
          | "totalBeforeMultipliers"
          | "traitMultiplier"
          | "statusEffectMultiplier"
          | "multipliersBonus"
          | "total"]: number;
      } {
    // Get status effects
    const statusEffects = this.getStatusEffects();

    // Get base stat
    let baseStat = 0;
    switch (stat) {
      case "SV":
        baseStat = Math.floor(this.SG / this.SPD);
        break;
      default:
        baseStat = config.baseStats[stat];
        if (stat in config.baseStatsDamage) baseStat = config.baseStatsDamage[stat];
        if (stat in config.baseStatsResistance) baseStat = config.baseStatsResistance[stat];
        break;
    }

    // Get bonus from level
    const levelBonusFunction = config["player_" + stat];
    const levelBonus = levelBonusFunction ? levelBonusFunction(this.level) : 0;
    baseStat += levelBonus;

    // ---------------------------------------
    // Define flat bonus
    let flatBonus = 0;

    // Get flat bonuses from equipment
    let weaponLevelBonus = 0;
    for (const [key, item] of Object.entries(this.equipment)) {
      // Get weapon stats
      if (item?.category == "weapon") {
        if (!item.weapon.type) continue;
        if (!Object.keys(config.baseWeaponStats).includes(stat)) continue;
        weaponLevelBonus += item.getStat(stat as WeaponStat);
      }
    }
    flatBonus += weaponLevelBonus;

    // ---------------------------------------
    // Define multipliers
    let multipliers = {
      traits: 1,
      statusEffects: 1,
    };

    // Get multipliers from traits
    let trait = 0;
    switch (stat) {
      case "ATK":
        trait = this.strength;
        break;
      case "MAG":
        trait = this.arcane;
        break;
      case "RES":
      case "MAG_RES":
        trait = this.defense;
        break;
      case "maxHP":
        trait = this.vitality;
        break;
    }
    const traitMultiplier = trait / 100;
    multipliers.traits += traitMultiplier;

    // Evaluate status effects
    let statusEffectMultiplier = 0;
    for (const statusEffect of statusEffects) {
      // Iterate through effect outomes
      for (const outcome of statusEffect.outcomes) {
        const levelBonus = (outcome?.levelScaling || 0) * statusEffect.level;
        // Modify stat
        if (outcome.type == "modify_stat") {
          const modifyStats = toArray(outcome.modifyStat);

          // Iterate through stat modifications
          for (const modifyStat of modifyStats) {
            if (modifyStat.stat !== stat) continue;
            if (modifyStat.scaling == "percent") {
              statusEffectMultiplier += (modifyStat.basePercent + levelBonus) / 100;
            } else if (modifyStat.scaling == "flat") {
              flatBonus += modifyStat.baseFlat + levelBonus;
            }
          }
        }
      }
    }
    multipliers.statusEffects += statusEffectMultiplier;

    // ---------------------------------------
    // Evaluate multipliers
    let totalBeforeMultipliers = baseStat + flatBonus;
    let total = totalBeforeMultipliers;
    let multipliersBonus = 0;
    for (const [key, multiplier] of Object.entries(multipliers)) {
      multipliersBonus += multiplier - 1;
      total *= multiplier;
    }
    multipliersBonus = Math.round(multipliersBonus);

    // Return all details
    if (verbose) {
      return {
        base: baseStat,
        flatBonus,
        weaponLevelBonus,
        totalBeforeMultipliers,
        traitMultiplier,
        statusEffectMultiplier,
        multipliersBonus,
        total,
      } as any;
    }
    // Return total value
    else {
      return Math.max(0, Math.floor(total)) as any;
    }
  }

  /** Get base stat before multipliers. */
  getBaseStat(stat: PlayerStat) {
    const { totalBeforeMultipliers } = this.getStat(stat, true);
    return totalBeforeMultipliers;
  }

  /** Get all stats. */
  getStats() {
    let object: { [key in PlayerStat]?: number } = {};
    for (const [stat, value] of Object.entries(config.baseStats)) {
      const total = this.getStat(stat as PlayerStat);
      object[stat] = total;
    }
    return object;
  }

  /** Get all base stats. */
  getBaseStats() {
    let object: { [key in PlayerStat]?: number } = {};
    for (const [stat, value] of Object.entries(config.baseStats)) {
      const total = this.getBaseStat(stat as PlayerStat);
      object[stat] = total;
    }
    return object;
  }

  /** Get remaining Xp required to reach next level. */
  get remainingXp() {
    return config.nextLevelXp(this.level) - this.xp;
  }

  /** Base Speed Value */
  get SV() {
    return this.getStat("SV");
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
  /** Crit Rate */
  get CR() {
    return this.getStat("CR");
  }
  /** Crit Damage */
  get CD() {
    return this.getStat("CD");
  }
  /** Acute Rate */
  get AR() {
    return this.getStat("AR");
  }
  /** Acute Damage */
  get AD() {
    return this.getStat("AD");
  }
  /** Aggro */
  get AGR() {
    return this.getStat("AGR");
  }
}

export default PlayerClass;

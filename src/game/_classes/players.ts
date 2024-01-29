import { createClassFromType, getTurnOrder, loadFiles } from "../../functions/core/index.js";
import { config } from "../../tower.js";

const PlayerBaseClass = createClassFromType<PlayerBase, false>();

export class PlayerClass extends PlayerBaseClass {
  constructor(player: PlayerBase) {
    super(player);
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
    stat: PlayerStat,
    verbose?: T
  ): T extends false
    ? number
    : { [key in "baseStat" | "levelBonus" | "traitBonus" | "weaponLevelBonus" | "total"]: number } {
    const baseStat = config.baseStats[stat];

    // Get flat bonus from level
    const levelBonusFunction = config["level_" + stat];
    const levelBonus = levelBonusFunction ? levelBonusFunction(this.level) : 0;

    // Get flat bonuses from traits
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
    const traitBonus = Math.floor((baseStat + levelBonus) * (trait / 100));

    // Get flat bonuses from equipment
    let weaponLevelBonus = 0;
    for (const [key, item] of Object.entries(this.equipment)) {
      // Get weapon stats
      if (item?.category == "weapon") {
        if (!item.weaponType) continue;
        weaponLevelBonus += item.getStat(stat as WeaponStat);
      }
    }

    const total = baseStat + levelBonus + traitBonus + weaponLevelBonus;
    if (verbose) return { baseStat, levelBonus, traitBonus, weaponLevelBonus, total } as any;
    return total;
  }

  /** Get base stat. */
  getBaseStat(stat: PlayerStat) {
    const { baseStat, levelBonus, traitBonus } = this.getStat(stat, true);
    return baseStat + levelBonus + traitBonus;
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
  get baseSV() {
    const gauge = config.speedGauge;
    const SV = Math.ceil(gauge / this.SPD);
    return SV;
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

import { createClassFromType, getTurnOrder, loadFiles } from "../../functions/core/index.js";
import { config } from "../../tower.js";

const PlayerBaseClass = createClassFromType<PlayerBase, false>();

export class PlayerClass extends PlayerBaseClass {
  constructor(player: PlayerBase) {
    super(player);
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

  /** Can currently attack. */
  get canAttack() {
    if (!this.encounter) return false;
    return this.encounter.currentPlayer == this.id;
  }

  // STATS =================================================================

  /** Get a specific evaluated stat. */
  getStat(stat: PlayerStat) {
    const baseStat = config.baseStats[stat];

    // Get flat bonus from level
    const levelBonusFunction = config["level_" + stat];
    const levelBonus = levelBonusFunction ? levelBonusFunction(this.level) : 0;

    // Get flat bonuses from equipment
    let weaponLevelBonus = 0;
    for (const [key, item] of Object.entries(this.equipment)) {
      // Get weapon stats
      if (item?.category == "weapon") {
        if (!item.weaponType) continue;
        const factor = config.weapons[item.weaponType][stat] || 0;
        const levelBonusFunction = config["weapon_" + stat];
        const levelBonus = levelBonusFunction ? levelBonusFunction(item.level, factor) : 0;
        weaponLevelBonus += levelBonus;
      }
    }

    const total = baseStat + levelBonus + weaponLevelBonus;
    return total;
  }

  /** Get all stats. */
  getStats() {
    const object = {
      maxHP: this.maxHP,
      ATK: this.ATK,
      MAG: this.MAG,
      RES: this.RES,
      "MAG RES": this.MAG_RES,
      SPD: this.SPD,
      CR: this.CR,
      CD: this.CD,
      AR: this.AR,
      AD: this.AD,
      AGR: this.AGR,
    };

    return object;
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
  /** Physical Resistance */
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

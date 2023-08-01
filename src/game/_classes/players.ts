import { createClassFromType, loadFiles } from "../../functions/core/index.js";
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

  // STATS ---------------------------------------------------------------

  /** Get all stats. */
  getStats() {
    const object = {
      maxHP: this.maxHP,
      ATK: this.ATK,
      MAG: this.MAG,
      RES: this.RES,
      MAG_RES: this.MAG_RES,
      SPD: this.SPD,
      CR: this.CR,
      CD: this.CD,
      AR: this.AR,
      AD: this.AD,
    };

    return object;
  }

  /** Max health */
  get maxHP() {
    const baseHP = config.baseStats.maxHP;
    return baseHP;
  }
  /** Attack */
  get ATK() {
    const baseATK = config.baseStats.ATK;
    return baseATK;
  }
  /** Magic */
  get MAG() {
    const baseMAG = config.baseStats.MAG;
    return baseMAG;
  }
  /** Physical resistance */
  get RES() {
    const baseRES = config.baseStats.RES;
    return baseRES;
  }
  /** Physical resistance */
  get MAG_RES() {
    const baseMAG_RES = config.baseStats["MAG RES"];
    return baseMAG_RES;
  }
  /** Speed */
  get SPD() {
    const baseSPD = config.baseStats.SPD;
    return baseSPD;
  }
  /** Crit rate */
  get CR() {
    const baseCR = config.baseStats.CR;
    return baseCR;
  }
  /** Crit damage */
  get CD() {
    const baseCD = config.baseStats.CD;
    return baseCD;
  }
  /** Acute rate */
  get AR() {
    const baseAR = config.baseStats.AR;
    return baseAR;
  }
  /** Acute damage */
  get AD() {
    const baseAD = config.baseStats.AD;
    return baseAD;
  }
}

export default PlayerClass;

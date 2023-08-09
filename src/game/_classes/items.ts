import fs from "fs";
import { createClassFromType, f, loadFiles } from "../../functions/core/index.js";
import { config } from "../../tower.js";

const ItemBaseClass = createClassFromType<ItemBase>();

export class ItemClass extends ItemBaseClass {
  constructor(item: Generic<ItemBase>) {
    super(item);
  }

  /** Get image object. */
  getImage(): { attachment: string; name: string } {
    // Format item name
    const itemName = this.getImageName();

    // Create path and check if item image exists
    let path = `./assets/items/${itemName}.png`;
    let file: any;

    // Change path for weapons
    if (this.category == "weapon") {
      path = `./assets/icons/${this.weaponType}.png`;
    }

    // Attach image
    if (fs.existsSync(path)) {
      // Get image file
      file = {
        attachment: path,
        name: `${itemName}.png`,
      };
    }

    return file;
  }

  /** Get emoji. */
  getEmoji(): string {
    const emojiName = this.getImageName();

    let emoji = config.emojis.items[emojiName];

    // Get weapon icon
    if (this.category == "weapon") {
      emoji = config.emojis.weapons[this.weaponType];
    }

    if (!emoji) emoji = config.emojis.blank;

    return emoji;
  }

  /** Get image name for generic type items. */
  getImageName() {
    let imageName = this.name.split(" ").join("_").toLowerCase();

    if (this.category == "map") imageName = "map";
    else if (this.category == "potion") imageName = "potion";
    else if (this.category == "recipe") imageName = "recipe";

    return imageName;
  }

  /** Get detailed description. */
  getDescription() {
    const { ATK, MAG, RES, SPD } = config.emojis.stats;
    let text = ``;
    if (this.info) text += `*${this.info}*\n`;
    text += `\nCategory: ${f(this.category)}`;

    // Weapon
    if (this.category == "weapon") {
      text += `\nWeapon Type: ${f(this.weaponType)}`;
      text += `\n\n${ATK} ${f(this.ATK)} | ${MAG} ${f(this.MAG)} | ${RES} ${f(this.RES)} | ${SPD} ${f(this.SPD)}`;
    }

    return text;
  }

  // STATS =================================================================

  /** Get a specific evaluated stat. */
  getStat(stat: WeaponStat) {
    if (this.category !== "weapon") return;

    const baseStat = config.baseWeaponStats?.[stat] || 0;

    const factor = config.weapons[this.weaponType]?.[stat] || 0;
    const levelBonusFunction = config["weapon_" + stat];
    const level = this.getLevel();
    const levelBonus = levelBonusFunction ? levelBonusFunction(level, factor) : 0;

    return baseStat + levelBonus;
  }

  /** Get item level. */
  getLevel() {
    const level = this.level || this?.stats?.baseLevel || 1;
    return level;
  }

  getGrade() {
    const grade = this.grade || this?.stats?.baseGrade || "common";
    return grade;
  }

  /** Attack */
  get ATK() {
    return this.getStat("ATK");
  }

  /** Attack */
  get MAG() {
    return this.getStat("MAG");
  }

  /** Attack */
  get RES() {
    return this.getStat("RES");
  }

  /** Attack */
  get SPD() {
    return this.getStat("SPD");
  }
}

const items = await loadFiles<ItemClass>("items", ItemClass);

export default items;

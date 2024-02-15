import fs from "fs";
import { loadFiles } from "../../functions/core/game/loadFiles.js";
import {
  createClassFromType,
  f,
  fastProgressBar,
  getStatusEffect,
  toArray,
} from "../../functions/core/index.js";
import { config, prisma } from "../../tower.js";
import { Prisma } from "@prisma/client";

const ItemBaseClass = createClassFromType<ItemBase>();

export class ItemClass extends ItemBaseClass {
  constructor(item: Generic<ItemBase>) {
    super(item);
  }

  /** Update the item in the database. */
  async update(args: Prisma.InventoryUncheckedUpdateInput | Prisma.InventoryUpdateInput) {
    const itemInfo = await prisma.inventory.update({
      where: { id: this.id },
      data: args,
    });
    return Object.assign(this, itemInfo);
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
      path = `./assets/icons/weapons/${this.weapon.type}.png`;
    }

    // Attach image
    if (fs.existsSync(path)) {
      // Get image file
      file = {
        attachment: path,
        name: `item.png`,
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
      emoji = config.emojis.weapons[this.weapon.type];
    }

    if (!emoji) emoji = config.emojis.blank;

    return emoji;
  }

  /** Get image name for generic type items. */
  getImageName() {
    let imageName = this.name.split(" ").join("_").toLowerCase();

    if (this.category == "map") imageName = "map";
    else if (this?.consumable?.type == "potion") imageName = "potion";
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
      text += `\nWeapon Type: ${f(this.weapon.type)}`;
      text += `\n\n${ATK} ${f(this.ATK)} | ${MAG} ${f(this.MAG)} | ${RES} ${f(
        this.RES
      )} | ${SPD} ${f(this.SPD)}`;
    }

    // Equipment XP Material
    if (this.category == "equipment XP material") {
      text += `\nXP: ${f(this.xpMaterial.amount)}`;
    }

    // Equipment
    if (this.category == "weapon" || this.category == "armor") {
      text += `\n\n${fastProgressBar("xp", this)}`;
    }

    // Applies status effect
    if (
      this.consumable &&
      toArray(this.consumable.effects).some((x) => x.type == "apply_status_effect")
    ) {
      const effects = toArray(this.consumable.effects);
      for (const effect of effects) {
        if (effect.type !== "apply_status_effect") continue;
        const statusEffect = getStatusEffect(effect.name);
        text += `\n\n${Object.assign(statusEffect, { level: effect?.level || 0 }).getInfo(true)}`;
      }
    }

    return text;
  }

  // STATS =================================================================

  /** Get a specific evaluated stat. */
  getStat(stat: WeaponStat) {
    if (this.category !== "weapon") return;

    const factor = config.weapons[this.weapon.type]?.[stat] || 0;

    const baseStat = config.baseWeaponStats?.[stat] * factor || 0;

    const levelBonusFunction = config["weapon_" + stat];
    const level = this.getLevel();
    const levelBonus = levelBonusFunction ? levelBonusFunction(level, factor) : 0;

    return baseStat + levelBonus;
  }

  /** Get item level. */
  getLevel() {
    const level = this.level || this?.weapon?.baseLevel || this?.armor?.baseLevel || 1;
    return level;
  }

  getGrade() {
    const grade = this.grade || this?.weapon?.baseGrade || this?.armor?.baseGrade || "common";
    return grade;
  }

  getEquipSlot() {
    return this?.weapon?.equipSlot || this?.armor?.equipSlot;
  }

  /** Get all stats. */
  getStats() {
    let object: { [key in WeaponStat]?: number } = {};
    for (const [stat, value] of Object.entries(config.baseWeaponStats)) {
      const total = this.getStat(stat as WeaponStat);
      object[stat] = total;
    }
    return object;
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

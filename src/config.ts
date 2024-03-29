import { Prisma } from "@prisma/client";
import { default as allEmojis } from "./emojis.js";

// This is the config file!
export const prefix = "-";
export const status = prefix + "help";
export const towerColor = 0xdbbbff;
export const defaultEmbedColor = 0x2b2d31; //0x191919;
//export const botColor = 0x191919;
export const green = 0x60ef00;
export const red = 0xff3838;
export const purple = 0x9600ff;
export const botBanner = "https://i.imgur.com/RwqxsiL.png";
export const botIcon = "https://i.imgur.com/S9LRuXa.png";
export const developerId = "326536300985581568";
export const guildOwnerWhitelist = [developerId];
export const emojis = {};
export const integerLimit = 2147483647;

export const baseSpeedGauge = 10000;

// Types of damage
export const damageTypes = [
  "slashing",
  "piercing",
  "bludgeoning",
  "air",
  "earth",
  "fire",
  "water",
  "void",
  "light",
] as const;
// The default player stats
export const baseStats = {
  maxHP: 20,
  ATK: 10,
  MAG: 10,
  SPC: 5,
  RES: 10,
  MAG_RES: 10,
  SPC_RES: 5,
  SPD: 80,
  CR: 10,
  CD: 40,
  AR: 10,
  AD: 40,
  AGR: 100,
};
export const baseStatsDamage = {
  bludgeoning_DMG: 0,
  piercing_DMG: 0,
  slashing_DMG: 0,
  fire_DMG: 0,
  water_DMG: 0,
  earth_DMG: 0,
  air_DMG: 0,
  void_DMG: 0,
  light_DMG: 0,
};
export const baseStatsResistance = {
  bludgeoning_RES: 0,
  piercing_RES: 0,
  slashing_RES: 0,
  fire_RES: 0,
  water_RES: 0,
  earth_RES: 0,
  air_RES: 0,
  void_RES: 0,
  light_RES: 0,
};
export const baseEnemyStats = {
  XP: 10,
  maxHP: 0,
  ATK: 5,
  MAG: 5,
  SPC: 5,
  RES: 5,
  MAG_RES: 5,
  SPC_RES: 5,
  SPD: 80,
};
export const baseWeaponStats = {
  ATK: 2,
  MAG: 2,
  RES: 2,
  SPD: 1,
};

export const defaultCommands = [
  "erase",
  "begin",
  "explore",
  "profile",
  "help",
  "unlockallcommands",
  "forgetallcommands",
  "unlockedcommands",
  "settings",
  "patchmissing",
  "leaderboard",
  "ping",
];

export const defaultWardrobe: PlayerWardrobe = {
  eyes: "black",
  skin: "white",
  hair: { name: "short", color: "red" },
  legs: { name: "trousers", color: "brown" },
  torso: { name: "plain_shirt", color: "pink" },
  feet: { name: "shoes", color: "black" },
};

export const cooldownGroups = {
  combat_action: "3",
  dungeon_action: "3",
};

export const playerDefaultEntries = {
  skill: ["unarmed combat"],
};

// Weapons and balancing
export const weapons = {
  sword: { ATK: 2, MAG: 0, RES: 1, SPD: 2 },
  spear: { ATK: 3, MAG: 0, RES: 0, SPD: 2 },
  staff: { ATK: 2, MAG: 0, RES: 0, SPD: 3 },
  axe: { ATK: 3, MAG: 0, RES: 1, SPD: 1 },
  hammer: { ATK: 3, MAG: 0, RES: 2, SPD: 0 },
  halberd: { ATK: 2, MAG: 0, RES: 3, SPD: 0 },
  bow: { ATK: 1, MAG: 0, RES: 2, SPD: 2 },
  unarmed: { ATK: 1, MAG: 1, RES: 0, SPD: 3 },
  shield: { ATK: 1, MAG: 0, RES: 4, SPD: 0 },
  amplifier: { ATK: 0, MAG: 4, RES: 0, SPD: 1 },
};

// Player traits
export const traits = ["strength", "defense", "arcane", "vitality"] as const;
// Possible equipment slots
export const equipSlots = ["head", "torso", "legs", "feet", "hand"] as const;
// Types of shards
export const shardTypes = ["grey", "green", "blue", "red", "pink", "legendary"] as const;
// Action types
export const actionTypes = ["weapon_attack", "magic", "ability"] as const;
// Action effect types
export const ActionOutcomeTypes = ["apply_status", "damage", "custom"] as const;
// Multiplier types
export const MultiplierTypes: { name: string; stat: Stat | "all" }[] = [
  { name: "DMG%", stat: "all" },
];
// Command categories
export const commandCategories = [
  "general",
  "player",
  "location",
  "item",
  "crafting",
  "combat",
  "dungeon",
  "settings",
  "other",
  "admin",
] as const;
// Descriptions for command categories
export const commandCategoryDescriptions = {
  general: "General commands.",
  player: "Commands relating to your character.",
  location: "Commands to travel and move in the game.",
  item: "Commands relating to items.",
  crafting: "Commands relating to crafting and recipes.",
  combat: "Commands relating to combat and cool things.",
  settings: "Boring commands for changing settings.",
  other: "Commands I didn't know where to put.",
  admin: "Hands off! Admins only.",
};

export const defaultAttackMessage = "TARGET attacks SOURCE and deals DAMAGE";

export const traitInfo = {
  strength: `Increases ${allEmojis.stats.ATK}\`ATK\` by \`+1%\``,
  defense: `Increases ${allEmojis.stats.RES}\`RES\` and ${allEmojis.stats.MAG_RES}\`MAG RES\` by \`+1%\``,
  arcane: `Increases ${allEmojis.stats.MAG}\`MAG\` by \`+1%\``,
  vitality: `Increases ${allEmojis.stats.maxHP}\`HP\` by \`+1%\``,
};

export const strongRate = 0.2;
export const weakRate = 0.2;

export const marksLostOnDeath = 0.5;

/** Range of XP gained for a skill per action. */
export const skillXpPerAction = [10, 20];

export const embedColors = {
  green: 0x00ff66,
  gold: 0xf6cd26,
  default: 0x2b2d31,
  red: 0xff1d1d,
  orange: 0xff621f,
  tower: towerColor,
};

// What to include when fetching player
export const playerInclude = {
  encounter: {
    include: {
      players: { include: { user: true } },
      enemies: { include: { statusEffects: true } },
    },
  },
  party: { include: { players: { include: { user: true } } } },
  exploration: true,
  statusEffects: true,
  inventory: true,
  dungeon: true,
} satisfies Prisma.PlayerInclude;

// What to include when fetching enemy
export const enemyInclude = {
  statusEffects: true,
} satisfies Prisma.EnemyInclude;

//* PLAYER LEVEL FORMULAS =======================================

// Required XP for next player level.
export const nextLevelXp = (lvl: number) => {
  let v = 5 * Math.pow(lvl, 2.2) + 100 * lvl + 50;
  if (lvl >= 90) v = 5 * Math.pow(lvl - 76, 3.8);
  return Math.floor(v);
};

// Required XP for next skill level.
export const nextLevelXpSkill = (lvl: number) => {
  let v = 5 * Math.pow(lvl, 2) + 50 * lvl + 60;
  if (lvl >= 25) v = 5 * Math.pow(lvl - 14, 2.9);
  return Math.floor(v);
};

// Get ATK based on level.
export const player_ATK = (lvl: number) => {
  let v = 3 * lvl + Math.pow(lvl, 1.3);
  return Math.floor(v);
};

// Get MAG based on level.
export const player_MAG = (lvl: number) => {
  let v = 3 * lvl + Math.pow(lvl, 1.3);
  return Math.floor(v);
};

// Get SPC based on level.
export const player_SPC = (lvl: number) => {
  let v = (3 * lvl + Math.pow(lvl, 1.3)) / 2;
  return Math.floor(v);
};

// Get maxHP based on level.
export const player_maxHP = (lvl: number) => {
  let v = lvl * 10 + Math.pow(lvl, 1.3);
  return Math.floor(v);
};

// Get RES based on level.
export const player_RES = (lvl: number) => {
  let v = lvl * 2 + Math.pow(lvl, 1.3);
  return Math.floor(v);
};

// Get MAG RES based on level.
export const player_MAG_RES = (lvl: number) => {
  let v = lvl * 2 + Math.pow(lvl, 1.3);
  return Math.floor(v);
};

// Get SPC RES based on level.
export const player_SPC_RES = (lvl: number) => {
  let v = (lvl * 2 + Math.pow(lvl, 1.3)) / 2;
  return Math.floor(v);
};

// Get SPD based on level.
export const player_SPD = (lvl: number) => {
  let v = lvl / 4 + Math.pow(lvl, 1.3) / 50;
  return Math.floor(v);
};

//* WEAPON LEVEL FORMULAS =======================================

// Required XP for next weapon level.
export const weapon_nextLevelXp = (lvl: number) => {
  let v = 5 * Math.pow(lvl, 2) + 50 * lvl + 50;
  return Math.floor(v);
};

// Get weapon ATK.
export const weapon_ATK = (lvl: number, factor: number) => {
  let v = (lvl * 8 + Math.pow(lvl, 1.4)) * 0.2 * factor;
  return Math.floor(v);
};

// Get weapon MAG.
export const weapon_MAG = (lvl: number, factor: number) => {
  let v = (lvl * 8 + Math.pow(lvl, 1.4)) * 0.2 * factor;
  return Math.floor(v);
};

// Get weapon RES
export const weapon_RES = (lvl: number, factor: number) => {
  let v = (lvl * 6 + Math.pow(lvl, 1.4)) * 0.2 * factor;
  return Math.floor(v);
};

// Get weapon SPD
export const weapon_SPD = (lvl: number, factor: number) => {
  let v = (lvl / 2 + Math.pow(lvl, 1.4) / 20) * 0.2 * factor;
  return Math.floor(v);
};

//* ENEMY LEVEL FORMULAS ============================================

// Get XP dropped by enemy.
export const enemy_XP = (lvl: number, boss = false) => {
  let v = Math.pow(lvl, 1.5) * 2 + lvl * 5;
  return Math.floor(v);
};

// Get enemy HP.
export const enemy_maxHP = (lvl: number, boss = false) => {
  let v = Math.pow(lvl, 1.9) + lvl * 2;
  if (boss) v = Math.pow(lvl, 1.9) + lvl * 100;
  return Math.floor(v);
};

// Get enemy ATK.
export const enemy_ATK = (lvl: number, boss = false) => {
  let v = Math.pow(lvl, 1.5) + lvl * 5;
  return Math.floor(v);
};

// Get enemy MAG.
export const enemy_MAG = (lvl: number, boss = false) => {
  let v = Math.pow(lvl, 1.5) + lvl * 5;
  return Math.floor(v);
};

// Get enemy SPC.
export const enemy_SPC = (lvl: number, boss = false) => {
  let v = (Math.pow(lvl, 1.5) + lvl * 5) / 2;
  return Math.floor(v);
};

// Get enemy RES.
export const enemy_RES = (lvl: number, boss = false) => {
  let v = Math.pow(lvl, 1.4) + lvl * 10;
  return Math.floor(v);
};

// Get enemy MAG RES.
export const enemy_MAG_RES = (lvl: number, boss = false) => {
  let v = Math.pow(lvl, 1.4) + lvl * 10;
  return Math.floor(v);
};

// Get enemy SPC RES.
export const enemy_SPC_RES = (lvl: number, boss = false) => {
  let v = (Math.pow(lvl, 1.4) + lvl * 10) / 2;
  return Math.floor(v);
};

// Get enemy SPD.
export const enemy_SPD = (lvl: number, boss = false) => {
  let v = lvl / 4 + Math.pow(lvl, 1.4) / 50;
  return Math.floor(v);
};

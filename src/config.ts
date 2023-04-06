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
export const emojis = {};
export const integerLimit = 2147483647;

export const stats = ["strength", "defence", "arcane", "vitality"];

export const equipSlots = ["head", "torso", "legs", "feet", "hand"] as const;
export const weaponTypes = ["sword", "axe", "bow", "spear", "rock"] as const;
export const damageTypes = [
  "slashing",
  "piercing",
  "bludgeoning",
  "air",
  "earth",
  "fire",
  "water",
] as const;
export const shardTypes = [
  "grey",
  "green",
  "blue",
  "red",
  "pink",
  "legendary",
] as const;
export const attackTypes = ["unarmed", ...weaponTypes] as const;
export const commandCategories = [
  "general",
  "player",
  "location",
  "item",
  "crafting",
  "combat",
  "settings",
  "other",
  "admin",
] as const;
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

export const defaultAttackMessage = "ENEMY attacks PLAYER and deals DAMAGE";

export const statInfo = {
  strength: "Physical damage dealt `+1%`",
  defence: "Physical damage taken `-1%`",
  arcane: "Magical damage dealt `+1%`",
  vitality: "Max health `+1`",
};

export const strongRate = 0.2;
export const weakRate = 0.2;

// Player level formula
export const nextLevelXp = (lvl: number) => {
  return 5 * Math.pow(lvl, 2) + 50 * lvl + 100;
};

// Skill level formula
export const nextLevelXpSkill = (lvl: number) => {
  return 5 * Math.pow(lvl, 2) + 20 * lvl + 100;
};

// Choose random entry from array
export function getRandom(array: any[]) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
}

// // Create area emoji description
// export function description(area: any) {
//   let description = "";

//   if (area.shop == true) description += emojis.shop;
//   if (area.danger == true) description += emojis.danger;
//   if (area.activities[0]) {
//     area.activities.forEach((activity) => {
//       description += emojis[activity];
//     });
//   }

//   return description;
// }

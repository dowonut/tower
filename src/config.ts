// This is the config file!
export const prefix = "-";
export const status = prefix + "help";
export const towerColor = 0xdbbbff;
export const botColor = 0x2f3136; //0x191919;
//export const botColor = 0x191919;
export const green = 0x60ef00;
export const red = 0xff3838;
export const purple = 0x9600ff;
export const botBanner = "https://i.imgur.com/RwqxsiL.png";
export const botIcon = "https://i.imgur.com/S9LRuXa.png";
export const developerId = "326536300985581568";

export const emojis = {
  bullet: "<:bullet:1007341922479771648>",
  green_bullet: "<:green_bullet:1010124816516382800>",
  level_up: "<:level_up:1011353610610806865>",
  blank: "<:blank:1002523614345703424>",
  mark: "<:mark:1004049049525174352>",
  silver_mark: "<:silver_mark:986634284355969026>",
  xp: "<:xp:987750164481597480>",
  floor: "<:floor:1011667156380950558>",
  plus: "<:plus:987810098183303208>",
  health: "<:health:1002667456684359721>",
  stats: {
    strength: "<:strength:1002671427914313880>",
    defence: "<:defence:1002673157523648663>",
    arcane: "<:arcane:1002680877161123850>",
    vitality: "<:vitality:1003975449401110538>",
  },
  damage: {
    fire: "<:fire_damage:988863829146468352>",
    water: "<:water_damage:988862206651301898>",
    air: "<:air_damage:988870803963666482>",
    earth: "<:earth_damage:988870754085003365>",
    void: "<:void_damage:988923541799989288>",
    light: "<:light_damage:988923540571033640>",
    bludgeoning: "<:bludgeoning_damage:988918961313828864>",
    piercing: "<:piercing_damage:988918962559524974>",
    slashing: "<:slashing_damage:988918963595542589>",
  },
  activities: {
    mining: ":pick:",
    fishing: ":fish:",
    woodcutting: ":evergreen_tree:",
  },
  items: {
    apple: "<:apple:1004006381927547060>",
    slimeball: "<:slimeball:1004006395487723600>",
    grey_shard: "<:grey_shard:1001631127980748800>",
    rusty_sword: "<:rusty_sword:1004051535749197925>",
    goblin_skin: "<:goblin_skin:1004067309792538655>",
    rock: "<:rock:1011001689752481852>",
    stick: "<:stick:1011002983846252604>",
    map: ":map:",
    recipe: ":scroll:",
    sword_handle: "<:sword_handle:1011008126864072704>",
    iron_sword: "<:iron_sword:1011009395901091870>",
    potion: "<:potion:1011596709589168168>",
  },
  enemies: {},
  bars: {
    health: {
      left: "<:health_left:1011322025639411782>",
      middle: "<:health_middle:1011322026721550449>",
      right: "<:health_right:1011322028390887484>",
    },
    xp: {
      left: "<:xp_left:1011340860929097769>",
      middle: "<:xp_middle:1011340862514548877>",
      right: "<:xp_right:1011340863886077982>",
    },
    empty: {
      left: "<:empty_left:1011322021235408916>",
      middle: "<:empty_middle:1011322022682439821>",
      right: "<:empty_right:1011322024204963860>",
    },
  },
};

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

export const prefix = "-";
export const status = prefix + "help";
//export const botColor = 0xdbbbff;
export const botColor = 0x2f3136; //0x191919;
export const green = 0xc0eda6;
export const red = 0xfd5d5d;
export const purple = 0x9600ff;
export const botBanner = "https://i.imgur.com/RwqxsiL.png";
export const botIcon = "https://i.imgur.com/S9LRuXa.png";

export const emojis = {
  bullet: "<:bullet:1007341922479771648>",
  blank: "<:blank:1002523614345703424>",
  mark: "<:mark:1004049049525174352>",
  silver_mark: "<:silver_mark:986634284355969026>",
  xp: "<:xp:987750164481597480>",
  staircase: "<:staircase:987744955067949126>",
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
    "grey shard": "<:grey_shard:1001631127980748800>",
    "rusty sword": "<:rusty_sword:1004051535749197925>",
    "goblin skin": "<:goblin_skin:1004067309792538655>",
  },
  enemies: {},
};

export const stats = ["strength", "defence", "arcane", "vitality"];

export const statInfo = {
  strength: "Increases physical damage output by `1%`",
  defence: "Decreases physical damage taken by `1%`",
  arcane: "Increases magical damage output by `1%`",
  vitality: "Increase max health by `1`",
};

// Player level formula
export const nextLevelXp = (lvl) => {
  return 5 * Math.pow(lvl, 2) + 50 * lvl + 100;
};

// Skill level formula
export const nextLevelXpSkill = (lvl) => {
  return 5 * Math.pow(lvl, 2) + 20 * lvl + 100;
};

// Choose random entry from array
export function getRandom(array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
}

// Create area emoji description
export function description(area) {
  let description = "";

  if (area.shop == true) description += emojis.shop;
  if (area.danger == true) description += emojis.danger;
  if (area.activities[0]) {
    area.activities.forEach((activity) => {
      description += emojis[activity];
    });
  }

  return description;
}

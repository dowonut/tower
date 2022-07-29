export const prefix = "-";
export const status = prefix + "help";
export const botColor = "#dbbbff";
export const embedColor = "#2f3136"; //"#191919";
export const green = "#C0EDA6";
export const red = "#FD5D5D";
export const purple = "#9600ff";
export const botBanner = "https://i.imgur.com/RwqxsiL.png";
export const botIcon = "https://i.imgur.com/S9LRuXa.png";

export const emojis = {
  blank: "<:blank:1002523614345703424>",
  mark: "<:mark:987827308234690701>",
  silver_mark: "<:silver_mark:986634284355969026>",
  xp: "<:xp:987750164481597480>",
  staircase: "<:staircase:987744955067949126>",
  plus: "<:plus:987810098183303208>",
  health: ":drop_of_blood:",
  defence: ":shield:",
  strength: ":crossed_swords:",
  arcane: ":star2:",
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
    fishing: ":fish:",
    woodcutting: ":evergreen_tree:",
  },
  enemies: {},
};

export const statInfo = {
  strength: "Increases physical damage output by `1%`",
  defence: "Decreases physical damage taken by `1%`",
  arcane: "Increases magical damage output by `1%`",
};

export const nextLevelXp = (lvl) => {
  return 5 * (lvl ^ 2) + 50 * lvl + 100;
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

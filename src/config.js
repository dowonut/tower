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
  mark: "<:marl:987827308234690701>",
  silver_mark: "<:silver_mark:986634284355969026>",
  xp: "<:xp:987750164481597480>",
  staircase: "<:staircase:987744955067949126>",
  plus: "<:plus:987810098183303208>",
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

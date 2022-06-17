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
  mark: "<:mark:986634284355969026>",
  xp: "<:xp:986631785058304001>",
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

// Get enemy from database
export async function getEnemy(enemyName, prisma) {
  const enemy = await prisma.enemyType.findMany({
    where: { name: { equals: enemyName, mode: "insensitive" } },
  });

  return enemy[0];
}

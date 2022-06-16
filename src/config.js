export const prefix = "-";
export const status = ",help";
export const botColor = "#dbbbff";
export const embedColor = "#2f3136"; //"#191919";
export const green = "#4bff45";
export const red = "#ff4545";
export const purple = "#9600ff";
export const banner =
  "https://media.discordapp.net/attachments/788544126526160969/891309463867367424/ascendant_banner.png";
export const botIcon =
  "https://cdn.discordapp.com/avatars/855569016810373140/94bb34839ff721a778973f1cb4818582.png?size=4096";

export const emojis = {
  foresting: "🪓",
  fishing: "🐟",
  danger: "⚔",
  map: "🗺",
  shop: "🛒",
};

// Create a simple embed
export function simpleEmbed(content) {
  return {
    color: embedColor,
    description: content,
  };
}

// Choose random entry from array
export function getRandom(array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
}

export const player = {
  // Delete player
  erase: async function () {
    await this.prisma.player.delete({
      where: { id: this.id },
    });
  },

  // Update player
  update: async function (update) {
    return await this.prisma.player.update({
      where: { id: this.id },
      data: update,
    });
  },

  // Get player location
  location: async function () {
    const region = await this.prisma.region.findUnique({
      where: { id: this.regionId },
      include: { areas: { orderBy: { id: "asc" } } },
    });

    const area = await this.prisma.area.findUnique({
      where: { id: this.areaId },
    });

    return { region, area };
  },

  // Get exploration for area
  exploration: async function (area) {
    const exploration = await this.prisma.exploration.findMany({
      where: { playerId: this.id, areaId: area.id },
    });

    return exploration[0] || null;
  },

  // Get exploration percentage
  explorationPercent: async function (area) {
    const areaE = area.exploration.length;
    const exploration = await this.exploration(area);
    const playerE = exploration.found.length;

    return Math.round((playerE / areaE) * 100) + "%";
  },
};

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

import { prisma, game } from "../../tower.js";

/** Add a new entry to tracked exploration. */
export default (async function (args: { type: ExplorationType; name?: string; category?: string }) {
  const { type, name, category } = args;
  const floor = this.floor;

  const existing = await prisma.exploration.findMany({
    where: {
      playerId: this.id,
      floor: floor,
      type: type.toLowerCase(),
      name: name ? name.toLowerCase() : undefined,
      category: category ? category.toLowerCase() : undefined,
    },
  });
  if (existing[0]) return;

  await prisma.exploration.create({
    data: {
      playerId: this.id,
      floor: floor,
      type: type.toLowerCase(),
      name: name ? name : undefined,
      category: category ? category : undefined,
    },
  });

  game.send({
    player: this,
    content: `*New ${type} discovered!\nSee your discoveries with \`${this.server.prefix}region\`*`,
  });
} satisfies PlayerFunction);

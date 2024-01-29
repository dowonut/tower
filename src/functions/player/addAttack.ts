import { game, prisma } from "../../tower.js";

/** Unlock a new attack. */
export default (async function (attackName: string) {
  const existingAttacks = await prisma.action.findMany({
    where: {
      playerId: this.id,
      name: { equals: attackName, mode: "insensitive" },
    },
  });
  if (existingAttacks[0]) return;

  await prisma.action.create({
    data: { playerId: this.id, name: attackName.toLowerCase() },
  });
} satisfies PlayerFunction);

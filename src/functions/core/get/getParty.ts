import { game, prisma } from "../../../tower.js";

/** Get party by ID */
export default async function getParty(id: number) {
  const party = await prisma.party.findUnique({
    where: { id },
    include: { players: { include: { user: true } } },
  });
  return party ? party : undefined;
}

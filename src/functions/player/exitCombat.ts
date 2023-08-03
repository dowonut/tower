import { game, prisma } from "../../tower.js";

/** Exit combat. */
export default (async function (message: Message) {
  // Handle party
  if (this.party) {
    if (this.party.leader !== this.id)
      return game.error({
        message,
        content: `Only the party leader can leave combat.`,
      });
    // Disconnect all party members from encounter
    await prisma.encounter.update({
      where: { id: this.encounterId },
      data: {
        players: {
          disconnect: this.party.players.map((x) => {
            return { id: x.id };
          }),
        },
      },
    });
  }
  // Not in a party
  else {
    await this.update({ encounterId: null });
  }

  await prisma.encounter.deleteMany({
    where: { players: { none: {} } },
  });
  return "success";
} satisfies PlayerFunction);

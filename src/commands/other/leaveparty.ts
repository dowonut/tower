import { game, prisma } from "../../tower.js";

export default {
  name: "leaveparty",
  aliases: ["lp"],
  description: "Leave your party.",
  category: "other",
  partyOnly: true,
  async execute(message, args, player, server) {
    // Player is NOT the leader
    let party: Party;
    if (player.party.leader !== player.id || player.party.players.length < 2) {
      party = await prisma.party.update({
        where: { id: player.party.id },
        data: { players: { disconnect: [{ id: player.id }] } },
        include: { players: true },
      });
    }
    // Player IS the leader
    else {
      const newLeader = player.party.players.find((x) => x.id !== player.id);
      party = await prisma.party.update({
        where: { id: player.party.id },
        data: {
          players: { disconnect: [{ id: player.id }] },
          leader: newLeader.id,
        },
        include: { players: true },
      });
    }

    await game.send({
      message,
      reply: true,
      content: `You left the party... 👋`,
    });

    // Delete party is one member is left
    if (party.players.length < 2) {
      await prisma.party.delete({ where: { id: party.id } });
      return "deleted";
    } else return "left";
  },
} satisfies Command;

import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "traitsrefund",
  aliases: ["trr", "traitrefund", "refundtraits"],
  description: "Refund all your trait points.",
  category: "player",
  async execute(message, args: { trait: PlayerTrait; amount: number | "all" }, player, server) {
    let totalPoints = 0;
    let prismaObject = {};
    config.traits.forEach((t) => {
      totalPoints += player[t];
      prismaObject[t] = 0;
    });
    if (totalPoints < 1)
      return game.error({ player, content: `you haven't invested any trait points.` });
    await player.update({ ...prismaObject, traitPoints: { increment: totalPoints } });
    await game.send({
      player,
      reply: true,
      content: `Refunded ${game.f(totalPoints)} trait points.`,
    });
  },
} satisfies Command;

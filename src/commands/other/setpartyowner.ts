import { game, prisma } from "../../tower.js";

export default {
  name: "setpartyowner",
  aliases: ["spo"],
  description: "Transfer party ownership to another player.",
  category: "other",
  arguments: [{ name: "player", required: true, type: "user" }],
  partyOnly: true,
  async execute(message, args, player, server) {
    if (!player.isPartyLeader)
      return game.error({
        player,
        content: `you're not the party leader silly.`,
      });
    if (!player.party.players.some((x) => x.id == args.player.id))
      return game.error({
        player,
        content: `this player is not in your party.`,
      });

    await prisma.party.update({
      where: { id: player.party.id },
      data: { leader: args.player.id },
    });

    game.send({
      player,
      reply: true,
      content: `Transferred party ownership to <@${args.player.user.discordId}> 👑`,
    });
  },
} satisfies Command;

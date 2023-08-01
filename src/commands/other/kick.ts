import { game, prisma } from "../../tower.js";

export default {
  name: "kick",
  aliases: ["ki"],
  description: "Kick a player from your party.",
  category: "other",
  arguments: [{ name: "player", required: true, type: "user" }],
  partyOnly: true,
  async execute(message, args, player, server) {
    if (!player.isPartyLeader)
      return game.error({
        message,
        content: `you're not the party leader silly.`,
      });
    if (!player.party.players.some((x) => x.id == args.player.id))
      return game.error({
        message,
        content: `this player is not in your party.`,
      });

    await prisma.party.update({
      where: { id: player.party.id },
      data: { players: { disconnect: [{ id: args.player.id }] } },
    });

    game.send({
      message,
      reply: true,
      content: `Kicked <@${args.player.user.discordId}> from the party.`,
    });
  },
} satisfies Command;

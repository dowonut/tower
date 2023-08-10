import { game, prisma } from "../../tower.js";

export default {
  name: "disbandparty",
  aliases: ["dp"],
  description: "Disband your party.",
  category: "other",
  partyOnly: true,
  async execute(message, args, player, server) {
    return new Promise(async (resolve) => {
      if (!player.isPartyLeader)
        return game.error({
          player,
          content: `you're not the party leader silly.`,
        });

      const buttons: Button[] = [
        {
          id: "disbandparty",
          label: "Disband",
          emoji: "💥",
          style: "success",
          function: async (r) => {
            await prisma.party.delete({ where: { id: player.party.id } });
            r.edit({ components: [], content: `**Party disbanded** 👍` });
            resolve("disband");
          },
        },
        {
          id: "canceldisband",
          label: "✖",
          style: "danger",
          function: (r) => {
            r.delete();
            resolve("cancel");
          },
        },
      ];

      const row = game.actionRow("buttons", buttons);

      const reply = await game.send({
        player,
        reply: true,
        components: [row],
        content: `Are you sure you want to disband the party?`,
      });

      game.componentCollector({
        player,
        botMessage: reply,
        components: buttons,
        options: {
          max: 1,
        },
      });
    });
  },
} satisfies Command;

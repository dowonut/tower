import { game, prisma, config } from "../../tower.js";

export default {
  name: "erase",
  description: "Completely reset your character.",
  cooldown: "60",
  category: "other",
  useInCombat: true,
  mustUnlock: false,
  async execute(message, args, player, server) {
    if (player.party) {
      return game.error({
        message,
        content: `you can't erase your player while in a party.`,
      });
    }

    const buttons: Button[] = [
      {
        id: "yes",
        label: "✔ Yes, erase everything.",
        style: "success",
        stop: true,
        async function() {
          // Erase player
          await player.erase();

          return await reply.edit({
            content: "**Reset complete** :white_check_mark:",
            components: [],
          });
        },
      },
      {
        id: "no",
        label: "✖",
        style: "danger",
        stop: true,
        async function() {
          return await reply.edit({
            content: "**Cancelled operation**",
            components: [],
          });
        },
      },
    ];

    const row = game.actionRow("buttons", buttons);

    const reply = await game.send({
      message,
      content: "⚠️ **Are you sure you want to permanently erase your character?**",
      components: [row],
      reply: true,
    });

    await game.componentCollector({ message, reply, components: buttons });
  },
} as Command;

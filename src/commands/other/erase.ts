import { game, prisma, config } from "../../tower.js";

export default {
  name: "erase",
  description: "Completely reset your character.",
  cooldown: "60",
  category: "other",
  useInCombat: true,
  async execute(message, args, player, server) {
    const buttons: Button[] = [
      {
        id: "yes",
        label: "✔ Yes, erase everything.",
        style: "success",
        async function() {
          return "yes";
        },
      },
      {
        id: "no",
        label: "✖",
        style: "danger",
        async function() {
          return "no";
        },
      },
    ];

    const row = game.actionRow("buttons", buttons);

    const reply = await game.send({
      message,
      content:
        "⚠️ **Are you sure you want to permanently erase your character?**",
      components: [row],
      reply: true,
    });

    const result = await game.componentCollector(message, reply, buttons);

    // If yes, then delete
    if (result == "yes") {
      // Erase player
      await player.erase();

      return await reply.edit({
        content: "**Reset complete** :white_check_mark:",
        components: [],
      });
    }
    // If no, then cancel
    else if (result == "no") {
      return await reply.edit({
        content: "**Cancelled operation**",
        components: [],
      });
    }
  },
} as Command;

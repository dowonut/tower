import { game, prisma, config } from "../../tower.js";

/** @type {Command} */
export default {
  name: "erase",
  description: "Completely reset your character.",
  cooldown: "60",
  category: "other",
  useInCombat: true,
  async execute(message, args, player, server) {
    /** @type {ComponentButton[]} */
    const buttons = [
      {
        id: "yes",
        label: "✔ Yes, erase everything.",
        style: "success",
        function() {
          return "yes";
        },
      },
      {
        id: "no",
        label: "✖",
        style: "danger",
        function() {
          return "no";
        },
      },
    ];

    const row = game.actionRow("buttons", buttons);

    const reply = await game.send({
      message,
      content:
        "**`Are you sure you want to permanently erase your character?`**",
      components: [row],
      reply: true,
    });

    const result = await game.componentCollector(message, reply, buttons);

    // If yes, then delete
    if (result == "yes") {
      // Erase player
      await player.erase();

      // Create new player with unlocked commands
      await game.createPlayer(message.author, player.unlockedCommands, server);
      return await reply.edit({
        content: "**`Reset complete`**",
        components: [],
      });
    }
    // If no, then cancel
    else if (result == "no") {
      return await reply.edit({
        content: "**`Cancelled operation`**",
        components: [],
      });
    }
  },
};

export default {
  name: "erase",
  description: "Completely reset your character.\nCANNOT BE UNDONE.",
  cooldown: "60",
  category: "Other",
  useInCombat: true,
  async execute(message, args, prisma, config, player, game, server) {
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

    const reply = await message.reply({
      content:
        "**`Are you sure you want to permanently erase your character?`**",
      components: [row],
    });

    const result = await game.componentCollector(message, reply, buttons);

    // If yes, then delete
    if (result == "yes") {
      // Erase player
      await player.erase();

      // Create new player with unlocked commands
      await game.createPlayer(
        message.author,
        prisma,
        game,
        player.unlockedCommands
      );
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

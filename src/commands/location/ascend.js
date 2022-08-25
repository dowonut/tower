export default {
  name: "ascend",
  aliases: ["as"],
  description: "Advance to the next floor. Requires 4 key fragments.",
  category: "Location",
  async execute(message, args, config, player, server) {
    game.reply(
      message,
      "you don't have all the key fragments to open the door..."
    );
  },
};

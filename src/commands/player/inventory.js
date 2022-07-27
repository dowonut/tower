export default {
  name: "inventory",
  aliases: ["i"],
  arguments: "",
  description: "List all your items.",
  category: "Player",
  async execute(message, args, prisma, config, player, game, server) {
    const items = await player.getItems();

    let description = ``;

    for (const item of items) {
      const quantity = item.quantity > 1 ? `\`x${item.quantity}\` | ` : ``;

      description += `**${item.name}** | ${quantity}${item.description}\n`;
    }

    const embed = {
      description: description,
    };

    game.fastEmbed(message, player, embed, `${player.username}'s Inventory`);
  },
};

export default {
  name: "inventory",
  aliases: ["i"],
  arguments: "",
  description: "List all your items.",
  category: "Player",
  useInCombat: true,
  async execute(message, args, prisma, config, player, game, server) {
    const items = await player.getItems();

    let description = ``;

    for (const item of items) {
      const quantity = item.quantity > 1 ? `\`x${item.quantity}\`` : undefined;
      const equipped = item.equipped ? `\`Equipped\`` : undefined;

      let emoji = config.emojis.items[item.name]
        ? config.emojis.items[item.name]
        : config.emojis.blank;

      description += `\n${emoji} **${item.getName()}**`;

      if (quantity) description += " | " + quantity;
      if (equipped) description += " | " + equipped;
      if (item.description) description += " | " + `*${item.description}*`;
    }

    const embed = {
      description: description,
    };

    game.fastEmbed(message, player, embed, `${player.username}'s Inventory`);

    player.unlockCommands(message, server, ["iteminfo"]);
  },
};

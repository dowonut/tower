export default {
  name: "statup",
  aliases: ["su"],
  arguments: "<stat> $ <quantity>|all",
  description: "Level up a stat using stat points.",
  category: "Player",
  async execute(message, args, prisma, config, player, game, server) {
    const variables = args.join(" ").split("$");

    const statInput = variables[0].trim();
    const quantityInput = variables[1];

    // Check for valid quantity
    let quantity = game.checkQuantity(quantityInput, game, message);
    if (!quantity) return;

    // Check if item name provided
    if (!statInput) return game.reply(message, "provide the name of a stat.");

    // Check if stat exists
    if (!config.statInfo[statInput.toLowerCase()])
      return game.reply(message, "not a valid stat.");

    // Set quantity to all
    if (quantity == "all") quantity = player.statpoints;

    // Check if has quantity
    if (quantity > player.statpoints)
      return game.reply(
        message,
        "you don't have enough stat points to do that."
      );

    // Update player info
    player = await player.update({
      statpoints: { increment: -quantity },
      [statInput]: { increment: quantity },
    });

    const statName = game.titleCase(statInput);

    // Send stat up message
    game.reply(
      message,
      `increased ${config.emojis[statInput]} **${statName}** to \`${player[statInput]}\``
    );
  },
};

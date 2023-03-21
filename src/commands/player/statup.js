import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "statup",
  aliases: ["su"],
  arguments: "<stat> $ <quantity>|all",
  description: "Level up a stat using stat points.",
  category: "player",
  async execute(message, args, player, server) {
    const variables = args.join(" ").split("$");

    const statInput = variables[0].trim().toLowerCase();
    const quantityInput = variables[1];

    // Check for valid quantity
    let quantity = game.checkQuantity(quantityInput, message);
    if (!quantity) return;

    // Check if item name provided
    if (!statInput)
      return game.error({ message, content: "provide the name of a stat." });

    // Check if stat exists
    if (!config.statInfo[statInput])
      return game.error({ message, content: "not a valid stat." });

    // Set quantity to all
    if (quantity == "all") quantity = player.statpoints;

    // Check if has quantity
    if (quantity > player.statpoints)
      return game.error({
        message,
        content: "you don't have enough stat points to do that.",
      });

    // Update player info
    const newPlayer = await player.update({
      statpoints: { increment: -quantity },
      [statInput]: { increment: quantity },
    });

    // Check which stat
    switch (statInput) {
      case "vitality":
        // Increase max health if vitality
        player.update({ maxHealth: { increment: quantity } });
    }

    const statName = game.titleCase(statInput);

    // Send stat up message
    game.send({
      message,
      reply: true,
      content: `increased ${config.emojis.stats[statInput]} **${statName}** to \`${newPlayer[statInput]}\``,
    });

    // Unlock breakdown command
    player.unlockCommands(message, server, ["breakdown"]);
  },
};

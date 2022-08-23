export default {
  name: "craft",
  aliases: ["c"],
  arguments: "<item name>",
  description: "Craft a specific item if you have the recipe.",
  category: "Crafting",
  async execute(message, args, prisma, config, player, game, server) {
    const input = args.join(" ");

    // Check if input for crafting item
    if (input) {
      // Fetch the player recipe
      const recipe = await player.fetch("recipe", input);

      // Check if recipe is unlocked
      if (!recipe)
        return game.error(
          message,
          `not a valid recipe.\nCheck your recipes with \`${server.prefix}recipes\``
        );

      // Check if player has all items required
      let missingItems = [];
      for (const item of recipe.items) {
        const playerItem = await player.getItem(item.name);

        const itemQuantity = item.quantity || 1;

        // Check if item exists or has right quantity
        if (!playerItem || playerItem.quantity < itemQuantity) {
          missingItems.push(game.titleCase(item.name));
          continue;
        }

        // Delete items required in recipe from inventory
        await player.giveItem(playerItem.name, -itemQuantity);
      }

      // Send missing items message
      if (missingItems[0])
        return game.error(
          message,
          `missing items: **${missingItems.join(", ")}**`
        );

      // Send craft start message
      game.reply(
        message,
        `started crafting \`1x\` **${game.titleCase(
          recipe.name
        )}** | :hourglass_flowing_sand: \`${game.formatTime(
          recipe.time
        )}\` remaining`
      );

      // Track crafting in database
      const date = new Date();
      await prisma.craft.create({
        data: {
          playerId: player.id,
          name: recipe.name,
          started: date,
          time: recipe.time,
        },
      });

      // Send message when finished crafting and give item
      return setTimeout(async () => {
        await player.giveItem(recipe.name);
        await prisma.craft.deleteMany({
          where: { playerId: player.id, name: recipe.name, started: date },
        });

        return game.reply(
          message,
          `finished crafting \`1x\` **${game.titleCase(recipe.name)}**`
        );
      }, recipe.time * 1000);
    }
    // IF NO INPUT PROVIDED
    else {
      // Fetch all ongoing crafts
      const crafts = await prisma.craft.findMany({
        where: { playerId: player.id },
      });

      let description = ``;
      // Format date for each craft
      for (const craft of crafts) {
        const now = Date.now();
        const started = Date.parse(craft.started);

        const secondsPassed = Math.floor((now - started) / 1000);
        const remainingSeconds = craft.time - secondsPassed;
        const time = game.formatTime(remainingSeconds);

        const craftName = game.titleCase(craft.name);

        description += `\n**${craftName}** | :hourglass_flowing_sand: \`${time}\` remaining`;
      }

      if (!crafts[0])
        description = `You have no items being crafted.\nCraft something with \`${server.prefix}craft <item name>\``;
      const title = `Crafting`;

      const embed = {
        description: description,
      };

      return game.fastEmbed(message, player, embed, title);
    }
  },
};

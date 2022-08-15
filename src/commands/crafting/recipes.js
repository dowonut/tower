export default {
  name: "recipes",
  aliases: ["re", "recipe"],
  arguments: "",
  description: "See your unlocked crafting recipes.",
  category: "Crafting",
  useInCombat: true,
  async execute(message, args, prisma, config, player, game, server) {
    const recipes = await player.getRecipes();

    // Check if player has any recipes
    if (!recipes[0])
      return game.error(message, `you haven't learned any recipes yet.`);

    let description = ``;
    for (const recipe of recipes) {
      description += `\n\n**${game.titleCase(recipe.name)}**`;

      let items = [];
      for (const item of recipe.items) {
        if (item.quantity) {
          items.push(`\`${item.quantity}x ${game.titleCase(item.name)}\``);
        } else {
          items.push(`\`${game.titleCase(item.name)}\``);
        }
      }
      let itemText = items.join(", ");

      description += `\nItems: ${itemText}`;
      description += `\nTime: \`${recipe.time} seconds\``;
    }

    description += `\n\nBegin crafting an item with \`${server.prefix}craft <item name>\``;

    const title = `Recipes`;
    const embed = {
      description: description,
    };

    game.fastEmbed(message, player, embed, title);

    player.unlockCommands(message, server, ["craft"]);
  },
};

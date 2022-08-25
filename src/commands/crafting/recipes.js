export default {
  name: "recipes",
  aliases: ["re", "recipe"],
  arguments: "",
  description: "See your unlocked crafting recipes.",
  category: "Crafting",
  useInCombat: true,
  async execute(message, args, config, player, server) {
    let recipes = await player.getRecipes();

    // Check if player has any recipes
    if (!recipes[0])
      return game.error(message, `you haven't learned any recipes yet.`);

    const { embed, title } = await getEmbed();

    const menu = new game.menu(getList, "menu");

    const reply = await game.fastEmbed(
      message,
      player,
      embed,
      title,
      undefined,
      [menu.row]
    );

    await menu.collector(message, reply);

    player.unlockCommands(message, server, ["craft"]);

    async function getEmbed() {
      let description = ``;
      for (const recipe of recipes) {
        // Check if player can craft recipe
        const available = recipe.available;

        // Set name
        if (available) {
          description += `\n\n**${game.titleCase(recipe.name)}**`;
        } else {
          description += `\n\n*${game.titleCase(recipe.name)}*`;
        }
        const itemText = await recipe.itemText(player, available);

        if (available) {
          description += `\nItems: ${itemText}`;
          description += `\nTime: \`${recipe.time} seconds\``;
        } else {
          description += `\n*Missing Items: ${itemText}*`;
        }
      }

      //description += `\n\nBegin crafting an item with \`${server.prefix}craft <item name>\``;

      const title = `Recipes`;
      const embed = {
        description: description,
      };

      return { embed, title };
    }

    function getList() {
      let list = {
        id: "recipemenu",
        placeholder: "Choose an item to craft...",
        options: [],
        function: async (reply, i, selection) => {
          // Run the craft command
          await game.runCommand("craft", message, [selection], server);
          // Get new recipes
          recipes = await player.getRecipes();
          // Update list
          await menu.updateButtons(reply);
          // Update embed
          const { embed } = await getEmbed();
          return await game.updateEmbed(reply, embed);
        },
      };

      for (const recipe of recipes) {
        if (recipe.available) {
          list.options.push({
            label: game.titleCase(recipe.name),
            value: recipe.name,
          });
        }
      }

      if (list.options.length < 1) return undefined;

      return list;
    }
  },
};

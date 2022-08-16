export default {
  name: "inventory",
  aliases: ["i"],
  arguments: "",
  description: "List all your items.",
  category: "Player",
  useInCombat: true,
  async execute(message, args, prisma, config, player, game, server, client) {
    const items = await player.getItems();

    // Create variables for modifying page
    let page = 1;
    let sort = "name";
    let filter = "all";

    // Boolean for showing list
    let showingList = false;

    const sortOptions = ["name", "value"];
    const filterOptions = ["all", "equipment", "crafting", "food", "other"];

    // Get total pages
    let totalPages = Math.ceil(items.length / 10);

    // Get embed with items
    const { embed, title } = getEmbed();

    // Get first row for changing page
    const { row, buttons } = rowOne();

    // Get second row for filtering and sorting
    const { row2, buttons2 } = rowTwo();

    const reply = await game.fastEmbed(
      message,
      player,
      embed,
      title,
      undefined,
      [row, row2]
    );

    await game.componentCollector(message, reply, [...buttons, ...buttons2]);

    // Unlock new commands
    player.unlockCommands(message, server, ["iteminfo"]);

    // Function for getting embed
    function getEmbed(page = 1, sort, filter) {
      let description = ``;

      const items = filterItems(sort, filter);

      // Update total pages
      totalPages = Math.ceil(items.length / 10);

      // Filter items by page
      const pageValue = page * 10;
      const pageItems = items.slice(pageValue - 10, pageValue);

      for (const item of pageItems) {
        // Get item quantity
        const quantity =
          item.quantity > 1 ? `\`x${item.quantity}\`` : undefined;
        // Get item equip status
        const equipped = item.equipped ? `\`Equipped\`` : undefined;

        // Get item emoji
        let emoji = config.emojis.items[item.name]
          ? config.emojis.items[item.name]
          : config.emojis.blank;

        // Set item name
        description += `\n${emoji} **${item.getName()}**`;

        if (quantity) description += " | " + quantity;
        if (equipped) description += " | " + equipped;
        //if (item.description) description += " | " + `*${item.description}*`;
      }

      const title = `${player.username}'s Inventory`;
      const embed = {
        description: description,
      };

      // Add footer page count if more than 1 page
      if (totalPages > 1) embed.footer = { text: `${page} / ${totalPages}` };

      return { embed, title };
    }

    // Function for filtering items
    function filterItems(sort = "name", filter = "all") {
      // Sort items
      if (sort == "name") {
        var sortedItems = [...items].sort((a, b) => (a.name > b.name ? 1 : -1));
      } else if (sort == "value") {
        var sortedItems = [...items].sort((a, b) => b.value - a.value);
      }

      // Set filter keys
      let filterKeys = [filter];
      if (filter == "equipment") {
        filterKeys = ["weapon", "armor"];
      } else if (filter == "other") {
        filterKeys = ["map", "enhancement", "recipe"];
      }

      // Filter items by category
      if (filter == "all") {
        var filteredItems = sortedItems;
      } else {
        var filteredItems = sortedItems.filter((x) =>
          filterKeys.includes(x.category)
        );
      }

      // Reset to first page
      page = 1;

      return filteredItems;
    }

    // Function for getting first row
    function rowOne() {
      const backDisable = page == 1 || showingList ? true : false;
      const nextDisable = page >= totalPages || showingList ? true : false;

      const buttons = [
        {
          id: "back",
          label: "◀",
          disable: backDisable,
          function: async (reply, i) => {
            page -= 1;
            await updateEmbed();
          },
        },
        {
          id: "next",
          label: "▶",
          disable: nextDisable,
          function: async (reply, i) => {
            page += 1;
            await updateEmbed();
          },
        },
      ];

      if (!showingList) {
        buttons.push({
          id: "iteminfo",
          emoji: "ℹ",
          stop: true,
          function: async (reply, i) => {
            toggleItemList(i);
            return;
          },
        });
      } else {
        buttons.push({
          id: "return",
          emoji: "↩",
          stop: true,
          function: async (reply, i) => {
            toggleItemList(i);
            return;
          },
        });
      }

      const row = game.actionRow("buttons", buttons);

      return { row, buttons };
    }

    // Function for getting second row
    function rowTwo() {
      const sortTitle = game.titleCase(sort);
      const filterTitle = game.titleCase(filter);

      const buttons2 = [
        {
          id: "sort",
          label: "Sort: " + sortTitle,
          function: async (reply, i) => {
            sort = game.cycleArray(sort, sortOptions);
            return await updateEmbed();
          },
        },
        {
          id: "filter",
          label: "Filter: " + filterTitle,
          function: async (reply, i) => {
            filter = game.cycleArray(filter, filterOptions);
            return await updateEmbed();
          },
        },
      ];
      const row2 = game.actionRow("buttons", buttons2);

      return { row2, buttons2 };
    }

    // Function for getting third row
    function rowThree() {
      const items = filterItems(sort, filter);

      let options = [];
      for (const item of items) {
        options.push({
          label: game.titleCase(item.name),
          description: item.info,
          value: item.name,
        });
      }

      const menu = {
        id: "menu",
        placeholder: "Select an item for more information...",
        options: options,
        function: async (reply, i, selection) => {
          return await itemInfo(selection);
        },
      };
      const row3 = game.actionRow("menu", menu);
      return { row3, menu };
    }

    // Update the embed
    async function updateEmbed() {
      // Get new embed
      const { embed, title } = getEmbed(page, sort, filter);

      // Get first row for changing page
      const { row } = rowOne();

      // Get second row for filtering and sorting
      const { row2 } = rowTwo();

      // Update original message
      const messageRef = await game.fastEmbed(
        message,
        player,
        embed,
        title,
        undefined,
        [row, row2],
        false
      );
      return await reply.edit(messageRef);
    }

    // Add item list to message
    async function toggleItemList() {
      showingList = showingList ? false : true;

      if (showingList) {
        const { row, buttons } = rowOne();

        const { row3, menu } = rowThree();

        await reply.edit({ components: [row, row3] });

        await game.componentCollector(message, reply, [menu, ...buttons]);
      } else {
        const { row, buttons } = rowOne();

        const { row2, buttons2 } = rowTwo();

        await reply.edit({ components: [row, row2] });

        await game.componentCollector(message, reply, [
          ...buttons,
          ...buttons2,
        ]);
      }
    }

    // Run iteminfo command
    async function itemInfo(selection) {
      return await game.runCommand(
        "iteminfo",
        client,
        message,
        [selection],
        prisma,
        game,
        server
      );
    }
  },
};

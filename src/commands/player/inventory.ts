import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "inventory",
  aliases: ["i", "items"],
  unlockCommands: ["iteminfo", "buy", "sell", "drink", "eat", "merchants", "equipment"],
  description: "View all your items.",
  category: "player",
  useInCombat: true,
  useInDungeon: true,
  async execute(message, args, player, server) {
    let items = await player.getItems();

    if (!items)
      return game.error({
        player,
        content: "you don't have any items yet...",
      });

    // Create variables for modifying page
    let page = 1;
    let sort = "name";
    let filter = "all";

    // Boolean for showing list
    let showingList = false;

    const sortOptions = ["name", "quantity", "value", "damage"];
    const filterOptions = ["all", "equipment", "crafting", "consumables", "other"];

    // Get total pages
    let totalPages = Math.ceil(items.length / 10);

    // Get embed with items
    const { embed, title } = getEmbed();

    // Get first row for changing page
    const { row, buttons } = rowOne();

    // Get second row for filtering and sorting
    const { row2, buttons2 } = rowTwo();

    const reply = (await game.fastEmbed({
      player,
      embed,
      title,
      components: [row, row2],
    })) as Message;

    await game.componentCollector({
      player,
      botMessage: reply,
      components: [...buttons, ...buttons2],
    });

    // Function for getting embed
    function getEmbed(page: number = 1, sort?: string, filter?: string) {
      let description = ``;

      const items = filterItems(sort, filter);

      // Boolean to check if player has any items
      const itemDisable = items.length < 1;

      // Update total pages
      totalPages = Math.ceil(items.length / 10);

      // Filter items by page
      const pageValue = page * 10;
      const pageItems = items.slice(pageValue - 10, pageValue);

      for (const item of pageItems) {
        // Get item quantity
        const quantity = item.quantity > 1 ? `\`x${item.quantity}\`` : undefined;
        // Get item equip status
        const equipped = item.equipped ? `\`Equipped\`` : undefined;
        // Get item value
        const value = item.value ? `\`${item.value}\`${config.emojis.mark}` : undefined;
        // Get damage value
        const damage = ``;

        // Get item emoji
        let emoji = item.getEmoji();

        // Set item name
        description += `\n${emoji} **${item.getName()}**`;

        if (quantity) description += " " + quantity;
        if (equipped) description += " | " + equipped;
        if (sort == "value") {
          if (value) description += " | " + value;
        }
        if (sort == "damage") {
          if (damage) description += " | " + damage;
        }
        //if (item.description) description += " | " + `*${item.description}*`;
      }

      if (itemDisable) description += `You don't have any items yet...`;

      const title = `Inventory`;
      const embed: any = {
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
      } else if (sort == "damage" || sort == "value" || sort == "quantity") {
        var sortedItems = [...items].sort((a, b) => {
          const bValue = b[sort] ? b[sort] : 0;
          const aValue = a[sort] ? a[sort] : 0;

          return bValue - aValue;
        });
      }

      // Set filter keys
      let filterKeys = [filter];
      if (filter == "equipment") {
        filterKeys = ["weapon", "armor"];
      } else if (filter == "other") {
        filterKeys = ["map", "enhancement", "recipe"];
      } else if (filter == "consumables") {
        filterKeys = ["food", "potion"];
      }

      // Filter items by category
      if (filter == "all") {
        var filteredItems = sortedItems;
      } else {
        var filteredItems = sortedItems.filter((x) => filterKeys.includes(x.category));
      }

      // Reset to first page
      //page = 1;

      return filteredItems;
    }
    // Function for getting first row
    function rowOne() {
      const backDisable = page == 1 || showingList ? true : false;
      const nextDisable = page >= totalPages || showingList ? true : false;

      // Boolean to check if player has any items
      const items = filterItems(sort, filter);
      const itemDisable = items.length < 1;

      const buttons: Button[] = [
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
          emoji: config.emojis.info,
          stop: true,
          disable: itemDisable,
          function: async (reply, i) => {
            toggleItemList();
            return;
          },
        });
      } else {
        buttons.push({
          id: "return",
          emoji: "↩",
          stop: true,
          function: async (reply, i) => {
            toggleItemList();
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

      // Boolean to check if player has any items
      const itemDisable = items.length < 1;

      const buttons2: Button[] = [
        {
          id: "sort",
          label: "Sort: " + sortTitle,
          disable: itemDisable,
          function: async (reply, i) => {
            page = 1;
            sort = game.cycleArray(sort, sortOptions);
            await updateEmbed();
          },
        },
        {
          id: "filter",
          label: "Filter: " + filterTitle,
          disable: itemDisable,
          function: async (reply, i) => {
            page = 1;
            filter = game.cycleArray(filter, filterOptions);
            await updateEmbed();
          },
        },
      ];
      const row2 = game.actionRow("buttons", buttons2);

      return { row2, buttons2 };
    }

    // Function for getting third row
    function rowThree() {
      const items = filterItems(sort, filter);

      let options: SelectMenuOption[] = [];
      for (const item of items) {
        options.push({
          label: game.titleCase(item.name),
          description: item.info,
          value: item.name,
          emoji: item.getEmoji(),
        });
      }

      const menu: SelectMenu = {
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
      // Get new items
      items = await player.getItems();

      // Get new embed
      const { embed, title } = getEmbed(page, sort, filter);

      // Get first row for changing page
      const { row } = rowOne();

      // Get second row for filtering and sorting
      const { row2 } = rowTwo();

      // Update original message
      const messageRef = await game.fastEmbed({
        player,
        embed,
        title,
        components: [row, row2],
        send: false,
      });

      return await reply.edit(messageRef);
    }

    // Add item list to message
    async function toggleItemList() {
      showingList = showingList ? false : true;

      // Update items and embed
      items = await player.getItems();

      // Switch to dropdown
      if (showingList) {
        const { row, buttons } = rowOne();

        const { row3, menu } = rowThree();

        if (!row || !row3) return;

        await reply.edit({ components: [row, row3] });

        await game.componentCollector({
          player,
          botMessage: reply,
          components: [menu, ...buttons],
        });
      }
      // Switch back to inventory menu
      else {
        // Get new embed
        const { embed, title } = getEmbed(page, sort, filter);

        const { row, buttons } = rowOne();

        const { row2, buttons2 } = rowTwo();

        // Update original message
        const messageRef = (await game.fastEmbed({
          player,
          embed,
          title,
          components: [row, row2],
          send: false,
        })) as MessageOptions;

        await reply.edit(messageRef);

        // Create a new collector
        await game.componentCollector({
          player,
          botMessage: reply,
          components: [...buttons, ...buttons2],
        });
      }
    }

    // Run iteminfo command
    async function itemInfo(selection: string) {
      return await game.runCommand("iteminfo", {
        message,
        args: [selection],
        server,
      });
    }
  },
} as Command;

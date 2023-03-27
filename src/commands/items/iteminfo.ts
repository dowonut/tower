import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "iteminfo",
  aliases: ["ii"],
  arguments: "<item name>",
  description: "Get detailed information about an item.",
  category: "items",
  useInCombat: true,
  async execute(message, args, player, server) {
    if (!args[0])
      return game.error({ message, content: "provide the name of an item." });

    // Get player item
    let item = await player.getItem(args.join(" "));

    // Check if showing sellbuttons
    let showingSellRow = false;

    // Check if item exists
    if (!item)
      return game.error({
        message,
        content: `not a valid item.\nCheck your items with \`${server.prefix}inventory\``,
      });

    // Get item embed
    const { embed, title, file } = getEmbed();

    // Get initial action buttons
    const { actionRow, actionButtons } = await getButtonRow();

    // Unlock commands
    player.unlockCommands(message, ["sell", "eat", "drink"]);

    // Get message
    const reply = (await game.fastEmbed({
      message,
      player,
      embed,
      title,
      files: file ? [file] : undefined,
      components: [actionRow],
    })) as Message;

    await game.componentCollector(message, reply, actionButtons);

    // Get embed
    function getEmbed() {
      // Format item description
      let description = `
    *${item.info}*\n
    Category: \`${game.titleCase(item.category)}\``;

      if (item.category == "weapon") {
        description += `\n\nWeapon Type: \`${game.titleCase(
          item.weaponType
        )}\``;
        description += `\nDamage: \`${item.damage}\`${
          config.emojis.damage[item.damageType]
        }`;
      }
      if (item.category == "potion") {
        item.effects.forEach((effect) => {
          description += `\n\nEffect: **${effect.info}**`;
        });
      }

      let embed: any = {
        description,
      };
      const title = `${item.getName()} ${
        item.quantity > 1 ? `(x${item.quantity})` : ``
      }`;

      // Get image
      const file = item.getImage();

      // Set embed thumbnail
      if (file)
        embed.thumbnail = {
          url: `attachment://${file.name}`,
        };

      return { embed, title, file };
    }

    // Get buttons
    async function getButtonRow() {
      // Disable function
      const disableCheck = player.inCombat || item.quantity < 1 ? true : false;

      // Create buttons
      /** @type {ComponentButton[]} */
      let buttons = [];

      // Create sell button
      if (item.value) {
        buttons.push({
          id: "sell",
          label: `Sell for ${item.value} marks`,
          emoji: config.emojis.mark,
          disable: disableCheck,
          function: async () => {
            if (item.quantity > 1) {
              sellMenu();
            } else {
              return await sell();
            }
          },
          stop: item.quantity > 1 ? true : false,
        });
      }
      // Create eat button
      if (item.health) {
        // Refresh player data
        const { health, maxHealth } = await player.refresh();
        const disable = disableCheck || health == maxHealth ? true : false;
        buttons.push({
          id: "eat",
          emoji: config.emojis.health,
          label: `Eat for ${item.health} HP`,
          style: "success",
          disable: disable,
          function: async () => {
            return await eat();
          },
        });
      }
      // Create equip button
      if (item.equipSlot) {
        // Get current equipped item
        let current = await player.getEquipment(item.equipSlot);

        // Check if item is equipped
        const equipped = current && current.name == item.name;
        const disable = disableCheck ? true : false;
        let label = equipped ? "Unequip" : "Equip";
        // Push button
        buttons.push({
          id: "equip",
          label: label,
          disable: disable,
          function: async () => {
            return await equip();
          },
        });
      }
      // Create drink button
      if (item.category == "potion") {
        buttons.push({
          id: "drink",
          label: "Drink",
          style: "success",
          disable: item.quantity < 1 ? true : false,
          function: async () => {
            return await drink();
          },
        });
      }

      // Check if any buttons have been created
      if (buttons.length < 1) return;

      // Created and return action row
      const row = game.actionRow("buttons", buttons);
      return { actionRow: row, actionButtons: buttons };
    }

    // Update main embed
    async function updateEmbed() {
      const { embed, title, file } = getEmbed();

      const messageRef = await game.fastEmbed({
        message,
        player,
        embed,
        title,
        send: false,
      });

      await reply.edit(messageRef);
    }

    // Update main button row
    async function updateButtonRow() {
      if (!showingSellRow) {
        var { actionRow: row } = await getButtonRow();
      } else {
        var { sellRow: row } = getSellRow();
      }

      await reply.edit({ components: [row] });
    }

    // Eat item
    async function eat() {
      await game.runCommand("eat", { message, args: [item.name], server });

      const newItem = await player.getItem(args.join(" "));
      item.quantity = newItem ? newItem.quantity : 0;
      await updateEmbed();
      await updateButtonRow();
    }

    // Sell item
    async function sell(quantity = 1) {
      await game.runCommand("sell", {
        message,
        args: [item.name, "$", quantity.toString()],
        server,
      });

      const newItem = await player.getItem(args.join(" "));
      item.quantity = newItem ? newItem.quantity : 0;
      await updateEmbed();
      await updateButtonRow();
    }

    // Sell item menu
    async function sellMenu() {
      // Update boolean
      showingSellRow = true;
      // Update original message
      const { sellRow, sellButtons } = getSellRow();
      await reply.edit({ components: [sellRow] });
      await game.componentCollector(message, reply, sellButtons);
    }

    // Get sell row and buttons
    function getSellRow() {
      const disable = item.quantity < 1 ? true : false;
      const sellButtons: Button[] = [
        {
          id: "one",
          label: "1",
          style: "success",
          disable: disable,
          function: async () => {
            return await sell();
          },
        },
        {
          id: "ten",
          label: "10",
          style: "success",
          disable: item.quantity < 10 ? true : false,
          function: async () => {
            return await sell(10);
          },
        },
        {
          id: "hundred",
          label: "100",
          style: "success",
          disable: item.quantity < 100 ? true : false,
          function: async () => {
            return await sell(100);
          },
        },
        {
          id: "all",
          label: "All",
          style: "success",
          disable: disable,
          function: async () => {
            return await sell(item.quantity);
          },
        },
        {
          id: "return",
          emoji: "↩",
          function: async () => {
            // Get initial action buttons
            const { actionRow, actionButtons } = await getButtonRow();
            await reply.edit({ components: [actionRow] });
            await game.componentCollector(message, reply, actionButtons);
          },
          stop: true,
        },
      ];
      const sellRow = game.actionRow("buttons", sellButtons);

      return { sellRow, sellButtons };
    }

    // Equip the item
    async function equip() {
      await game.runCommand("equipment", {
        message,
        args: [item.name],
        server,
      });

      player = await player.refresh();
      await updateEmbed();
      await updateButtonRow();
    }

    // Drink potion
    async function drink() {
      await game.runCommand("drink", { message, args: [item.name], server });

      const newItem = await player.getItem(args.join(" "));
      item.quantity = newItem ? newItem.quantity : 0;
      await updateEmbed();
      await updateButtonRow();
    }
  },
} as Command;

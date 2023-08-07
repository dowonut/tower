import { MessageEditOptions } from "discord.js";
import { game, config, client, prisma } from "../../tower.js";
import { f } from "../../functions/core/index.js";

export default {
  name: "iteminfo",
  aliases: ["ii"],
  arguments: [{ name: "item", type: "playerOwnedItem" }],
  description: "Get detailed information about an item.",
  category: "item",
  useInCombat: true,
  async execute(message, args: { item: Item }, player, server) {
    // Get player item
    let { item } = args;

    // Check if item exists
    if (!item)
      return game.error({
        message,
        content: `not a valid item.\nCheck your items with \`${server.prefix}inventory\``,
      });

    const menu = new game.Menu({
      message,
      player,
      boards: [
        { name: "main", rows: ["main"], message: "main" },
        { name: "sell", rows: ["sell"] },
      ],
      rows: [
        // Main buttons
        {
          name: "main",
          type: "buttons",
          components: async (m) => {
            let buttons: Button[] = [];
            const disableCheck = player.inCombat || item.quantity < 1;

            // Create sell button
            if (item.value) {
              buttons.push({
                id: "sell",
                label: `Sell for ${item.value} marks`,
                emoji: config.emojis.mark,
                disable: disableCheck,
                function: async () => {
                  if (item.quantity > 1) {
                    m.switchBoard("sell");
                  } else {
                    await sell(1);
                    m.refresh();
                  }
                },
              });
            }
            // Create eat button
            if (item.health) {
              // Refresh player data
              const { health, maxHP } = m.player;
              const disable = disableCheck || health == maxHP ? true : false;
              buttons.push({
                id: "eat",
                emoji: config.emojis.health,
                label: `Eat for ${item.health} HP`,
                style: "success",
                disable: disable,
                function: async () => {
                  await eat();
                  m.refresh();
                },
              });
            }
            // Create equip button
            if (item.equipSlot) {
              // Get current equipped item
              let current = await m.player.getEquipment(item.equipSlot);

              // Check if item is equipped
              const equipped = current?.name == item.name;
              const disable = disableCheck;
              let label = equipped ? "Unequip" : "Equip";
              // Push button
              buttons.push({
                id: "equip",
                label: label,
                disable: disable,
                function: async () => {
                  await equip();
                  m.refresh();
                },
              });
            }
            // Create drink button
            if (item.category == "potion") {
              buttons.push({
                id: "drink",
                label: "Drink",
                style: "success",
                disable: item.quantity < 1,
                function: async () => {
                  await drink();
                  m.refresh();
                },
              });
            }

            return buttons;
          },
        },
        // Sell buttons
        {
          name: "sell",
          type: "buttons",
          components: async (m) => {
            const disable = item.quantity < 1 ? true : false;
            const buttons: Button[] = [
              {
                id: "one",
                label: "1",
                style: "success",
                disable: disable,
                function: async () => {
                  await sell();
                  m.refresh();
                },
              },
              {
                id: "ten",
                label: "10",
                style: "success",
                disable: item.quantity < 10 ? true : false,
                function: async () => {
                  await sell(10);
                  m.refresh();
                },
              },
              {
                id: "hundred",
                label: "100",
                style: "success",
                disable: item.quantity < 100 ? true : false,
                function: async () => {
                  await sell(100);
                  m.refresh();
                },
              },
              {
                id: "all",
                label: "All",
                style: "success",
                disable: disable,
                function: async () => {
                  await sell(item.quantity);
                  m.refresh();
                },
              },
              {
                id: "return",
                board: "main",
              },
            ];
            return buttons;
          },
        },
      ],
      messages: [
        // Main item message
        {
          name: "main",
          function: (m) => {
            // Format item description
            let description = item.getDescription();

            let title = `${item.getName()} ${item.quantity > 1 ? `(x${item.quantity})` : ``}`;

            if (item.category == "weapon") {
              title += ` | \`Lvl. ${item.level}\``;
            }

            let embed: any = {
              description,
            };

            // Get image
            const file = item.getImage() || undefined;
            const files = file ? [file] : undefined;

            // Set embed thumbnail
            if (file)
              embed.thumbnail = {
                url: `attachment://${file.name}`,
              };

            return game.fastEmbed({ message, player, embed, title, files, fullSend: false });
          },
        },
      ],
    });

    menu.init("main");

    // Unlock commands
    player.unlockCommands(message, ["sell", "eat", "drink"]);

    // FUNCTIONS ===============================================================

    // Eat item
    async function eat() {
      await game.runCommand("eat", { message, args: [item.name], server });
      const { quantity } = (await player.getItem(item.name)) || {};
      item.quantity = quantity;
    }

    // Sell item
    async function sell(amount = 1) {
      await game.runCommand("sell", {
        message,
        args: [item.name, amount.toString()],
        server,
      });
      const { quantity } = (await player.getItem(item.name)) || {};
      item.quantity = quantity;
    }

    // Equip the item
    async function equip() {
      await game.runCommand("equipment", {
        message,
        args: [item.name],
        server,
      });
      item = await player.getItem(item.name);
    }

    // Drink potion
    async function drink() {
      await game.runCommand("drink", { message, args: [item.name], server });
      const { quantity } = (await player.getItem(item.name)) || {};
      item.quantity = quantity;
    }
  },
} as Command;

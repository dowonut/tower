import { MessageEditOptions } from "discord.js";
import { game, config, client, prisma } from "../../tower.js";
import { f } from "../../functions/core/index.js";
import emojis from "../../emojis.js";

export default {
  name: "iteminfo",
  aliases: ["ii"],
  unlockCommands: ["sell", "eat", "drink", "buy", "equipment", "equipmentup"],
  arguments: [{ name: "item", type: "playerOwnedItem" }],
  description: "View detailed information about an item.",
  category: "item",
  useInCombat: true,
  useInDungeon: true,
  async execute(message, args: { item: Item }, player, server) {
    // Get player item
    let { item } = args;

    // Check if item exists
    if (!item)
      return game.error({
        player,
        content: `not a valid item.\nCheck your items with \`${server.prefix}inventory\``,
      });

    const menu = new game.Menu({
      player,
      variables: { selectedEssence: undefined as "frail" | "ordinary" | "potent" },
      boards: [
        { name: "main", rows: ["main"], message: "main" },
        { name: "sell", rows: ["sell"], message: "main" },
        { name: "level_up", rows: ["level_up"], message: "main" },
        { name: "select_essence_amount", rows: ["select_essence_amount"], message: "main" },
      ],
      rows: [
        // Main buttons
        {
          name: "main",
          type: "buttons",
          components: async (m) => {
            let buttons: Button[] = [];
            if (!item) return [];
            const disableCheck = player.inCombat || item?.quantity < 1;

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
            if (item?.consumable?.type == "food") {
              // Refresh player data
              const { health, maxHP } = m.player;
              const disable = disableCheck || health == maxHP ? true : false;
              buttons.push({
                id: "eat",
                emoji: config.emojis.health,
                label: `Eat`,
                style: "success",
                disable: disable,
                function: async () => {
                  await eat();
                  m.refresh();
                },
              });
            }
            // Create equip button
            if (item.getEquipSlot()) {
              // Get current equipped item
              let current = await m.player.getEquipment(item.weapon.equipSlot);

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
            if (item?.consumable?.type == "potion") {
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
            // Create locate dungeon button
            if (item.category == "map" && item.dungeon) {
              buttons.push({
                id: "locate_dungeon",
                label: "Locate Dungeon",
                style: "success",
                emoji: "🔎",
                disable: player.exploration.some(
                  (x) => x.type == "dungeon" && x.name == item.dungeon.name
                ),
                function: async () => {
                  await player.giveItem(item.name, -1);
                  await player.addExploration({ type: "dungeon", name: item.dungeon.name });
                  await m.botMessage.delete();
                  await game.send({
                    player,
                    reply: true,
                    content: `You've uncovered the location of the **${game.titleCase(
                      item.dungeon.name
                    )}**`,
                  });
                  await player.unlockCommands(["dungeons"]);
                },
              });
            }

            // Create level up buttons
            if (item.category == "armor" || item.category == "weapon") {
              buttons.push({
                id: "level_up",
                style: "success",
                label: "Level Up",
                emoji: emojis.up,
                function: async () => {
                  await m.switchBoard("level_up");
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
        // Level up buttons
        {
          name: "level_up",
          type: "buttons",
          components: async (m) => {
            const frailEssence = game.getItem("frail essence");
            const ordinaryEssence = game.getItem("ordinary essence");
            const potentEssence = game.getItem("potent essence");

            return [
              {
                id: "frail_essence",
                emoji: frailEssence.getEmoji(),
                label: `(${
                  m.player.inventory.find((x) => x.name == "frail essence")?.quantity || `0`
                })`,
                disable: !m.player.inventory.find((x) => x.name == "frail essence"),
                style: "primary",
                function: async () => {
                  if (m.player.inventory.find((x) => x.name == "frail essence").quantity > 1) {
                    m.variables.selectedEssence = "frail";
                    m.switchBoard("select_essence_amount");
                  } else {
                    await levelUp({ frail: 1 });
                  }
                },
              },
              {
                id: "ordinary_essence",
                emoji: ordinaryEssence.getEmoji(),
                label: `(${
                  m.player.inventory.find((x) => x.name == "ordinary essence")?.quantity || `0`
                })`,
                disable: !m.player.inventory.find((x) => x.name == "ordinary essence"),
                style: "primary",
                function: async () => {
                  if (m.player.inventory.find((x) => x.name == "ordinary essence").quantity > 1) {
                    m.variables.selectedEssence = "ordinary";
                    m.switchBoard("select_essence_amount");
                  } else {
                    await levelUp({ ordinary: 1 });
                  }
                },
              },
              {
                id: "potent_essence",
                emoji: potentEssence.getEmoji(),
                label: `(${
                  m.player.inventory.find((x) => x.name == "potent essence")?.quantity || `0`
                })`,
                disable: !m.player.inventory.find((x) => x.name == "potent essence"),
                style: "primary",
                function: async () => {
                  if (m.player.inventory.find((x) => x.name == "potent essence").quantity > 1) {
                    m.variables.selectedEssence = "potent";
                    m.switchBoard("select_essence_amount");
                  } else {
                    await levelUp({ potent: 1 });
                  }
                },
              },
              {
                id: "return",
                board: "main",
              },
            ];
          },
        },
        // Select essence amount
        {
          name: "select_essence_amount",
          type: "buttons",
          components: (m) => [
            {
              id: "one",
              label: "Use 1",
              style: "success",
              disable:
                !m.player.inventory.find(
                  (x) => x.name == `${m.variables.selectedEssence} essence`
                ) ||
                m.player.inventory.find((x) => x.name == `${m.variables.selectedEssence} essence`)
                  ?.quantity < 1,
              function: async () => {
                await levelUp({ [m.variables.selectedEssence]: 1 });
              },
            },
            {
              id: "ten",
              label: "Use 10",
              style: "success",
              disable:
                !m.player.inventory.find(
                  (x) => x.name == `${m.variables.selectedEssence} essence`
                ) ||
                m.player.inventory.find((x) => x.name == `${m.variables.selectedEssence} essence`)
                  ?.quantity < 10,
              function: async () => {
                await levelUp({ [m.variables.selectedEssence]: 10 });
              },
            },
            {
              id: "all",
              label: "Use All",
              style: "success",
              disable:
                !m.player.inventory.find(
                  (x) => x.name == `${m.variables.selectedEssence} essence`
                ) ||
                m.player.inventory.find((x) => x.name == `${m.variables.selectedEssence} essence`)
                  ?.quantity < 1,
              function: async () => {
                await levelUp({ [m.variables.selectedEssence]: "all" });
              },
            },
            {
              id: "return",
              board: "level_up",
            },
          ],
        },
      ],
      messages: [
        // Main item message
        {
          name: "main",
          function: (m) => {
            // Delete item when no more in inventory.
            if (!item || item?.quantity < 1) {
              m.botMessage.delete();
              return;
            }

            // Format item description
            let description = item.getDescription();

            let title = `${item.getName()} ${item.quantity > 1 ? `(x${item.quantity})` : ``}`;

            if (item.category == "weapon" || item.category == "armor") {
              title += ` | \`Lvl. ${item.getLevel()}\``;
            }

            let embed: Embed = {
              description,
            };

            // Get image
            const file = item.getImage() || undefined;
            const files = file ? [file] : undefined;

            // Set embed thumbnail
            if (file)
              embed.thumbnail = {
                url: `attachment://item.png`,
              };

            return game.fastEmbed({ player, embed, title, files, fullSend: false });
          },
        },
      ],
      async onRefresh(m) {
        item = await player.getItem(item.name);
      },
    });

    menu.init("main");

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
    }

    // Drink potion
    async function drink() {
      await game.runCommand("drink", { message, args: [item.name], server });
      const { quantity } = (await player.getItem(item.name)) || {};
      item.quantity = quantity;
    }

    async function levelUp(args: {
      frail?: number | "all";
      ordinary?: number | "all";
      potent?: number | "all";
    }) {
      const { frail = 0, ordinary = 0, potent = 0 } = args;

      await game.runCommand("equipmentup", {
        args: [item.name, frail.toString(), ordinary.toString(), potent.toString()],
        discordId: player.user.discordId,
        channel: player.channel,
        server: player.server,
      });

      menu.refresh();
    }
  },
} as Command;

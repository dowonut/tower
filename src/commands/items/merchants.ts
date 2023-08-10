import { Menu, f } from "../../functions/core/index.js";
import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "merchants",
  aliases: ["m", "merchant"],
  arguments: [{ name: "merchant", type: "playerAvailableMerchant", required: false }],
  description: "See all merchants on this floor and the items they sell.",
  category: "item",
  async execute(message, args, player, server) {
    const input = args.merchant;
    let merchant: Merchant;
    if (input) merchant = game.getMerchant(input);

    // Fetch unlocked merchants
    const merchants = await player.getUnlockedMerchants();

    // Check if player has unlocked any merchants
    if (!merchants[0])
      return game.error({
        player,
        content: `you haven't met any merchants yet. Try exploring the village...`,
      });

    const menu = new game.Menu({
      player,
      variables: {
        currentMerchant: undefined as Merchant,
        currentItem: undefined as MerchantItemMerged,
      },
      // Boards -----------------------------------------------------
      boards: [
        {
          name: "listMerchants",
          rows: ["selectMerchant"],
          message: "merchantsEmbed",
        },
        {
          name: "merchant",
          rows: ["selectMerchant", "selectItem"],
          message: "merchantEmbed",
        },
        {
          name: "itemSelected",
          rows: ["selectMerchant", "selectItem", "buyItem"],
          message: "merchantEmbed",
        },
      ],
      // Rows -----------------------------------------------------
      rows: [
        {
          name: "selectMerchant",
          type: "menu",
          components: async (m) => {
            const options: SelectMenuOption[] = merchants.map((x) => {
              return {
                label: x.getName(),
                value: x.name,
                description: x.description || "A friendly merchant.",
                default: m.variables.currentMerchant && m.variables.currentMerchant.name == x.name ? true : false,
              };
            });
            return {
              id: "selectMerchant",
              function(r, i, s) {
                m.variables.currentMerchant = merchants.find((x) => x.name == s);
                m.switchBoard("merchant");
              },
              options,
              placeholder: "Select a merchant to see their stock...",
            };
          },
        },
        {
          name: "selectItem",
          type: "menu",
          components: async (m) => {
            const options: SelectMenuOption[] = (await m.variables.currentMerchant.getItems(player)).map((x) => {
              return {
                label: x.getName(),
                value: x.name,
                emoji: x.getEmoji(),
                default: m.variables.currentItem && m.variables.currentItem.name == x.name ? true : false,
              };
            });

            return {
              id: "selectItem",
              async function(r, i, s) {
                m.variables.currentItem = await game.getMerchantItem(s, player);
                m.switchBoard("itemSelected");
              },
              placeholder: "Select an item for more options...",
              options,
            };
          },
        },
        {
          name: "buyItem",
          type: "buttons",
          components: async (m) => {
            async function buy(quantity: number | "all", item: string) {
              await game.runCommand("buy", {
                message,
                server,
                args: [item, quantity.toString()],
              });
            }
            const item = m.variables.currentItem;
            const merchantItem = await game.getMerchantItem(item.name, player);
            const marks = m.player.marks;
            const max = Math.min(Math.floor(marks / item.price), merchantItem.stock);

            return [
              {
                id: "buy_1",
                style: "success",
                label: "Buy 1",
                disable: item.price > marks ? true : false || merchantItem.stock < 1,
                async function() {
                  await buy(1, m.variables.currentItem.name);
                  m.refresh();
                },
              },
              {
                id: "buy_10",
                style: "success",
                label: "Buy 10",
                disable: item.price * 10 > marks ? true : false || merchantItem.stock < 10,
                async function() {
                  await buy(10, m.variables.currentItem.name);
                  m.refresh();
                },
              },
              {
                id: "buy_max",
                style: "success",
                label: `Buy Max (${max})`,
                disable: item.price > marks ? true : false || merchantItem.stock < 1,
                async function() {
                  await buy("all", m.variables.currentItem.name);
                  m.refresh();
                },
              },
            ];
          },
        },
      ],
      // Messages -----------------------------------------------------
      messages: [
        // Get all merchants
        {
          name: "merchantsEmbed",
          function: async (m) => {
            let description = merchants
              .map(
                (x) =>
                  `**${x.getName()}** (\`${game.titleCase(x.category)}\`) *${x.description || "A friendly merchant."}*`
              )
              .join("\n");

            const balanceText = `Your balance: \`${m.player.marks}\` ${config.emojis.mark}`;
            description += `\n\n${balanceText}`;

            return game.fastEmbed({
              fullSend: false,
              reply: true,
              description,
              title: `Merchants on Floor ${m.player.floor}`,
              player: m.player,
            });
          },
        },
        // Get specific merchant
        {
          name: "merchantEmbed",
          function: async (m) => {
            const merchant = m.variables.currentMerchant;
            let description = ``;

            for (const item of await merchant.getItems(m.player)) {
              const emoji = item.getEmoji();
              let highlighted = "";
              if (m.variables.currentItem !== undefined) {
                if (m.variables.currentItem.name == item.name) {
                  highlighted = "👉 ";
                } else {
                  highlighted = config.emojis.blank + " ";
                }
              }

              if (item.stock > 0) {
                const itemStock = `x${item.stock}`;
                const itemName = `**${item.getName()}**`;
                let other = ``;
                if (item.category == "weapon") other += ` \`Lvl.${item.getLevel()}\` |`;
                description += `\n${highlighted}${emoji} ${itemName}${other} \`${itemStock}\` | \`${item.price}\`${config.emojis.mark}`;
              } else {
                let itemStock = `out of stock`;
                if (item.restock) {
                  const restocked = item.restocked;
                  const date = new Date().getDate();
                  itemStock = `restocks in ${item.restock - (date - restocked)} days`;
                }
                const itemName = `${item.getName()}`;
                description += `\n${highlighted}${emoji} ${itemName} \`${itemStock}\``;
              }
            }

            if (m.variables.currentItem) {
              description += `\n\n` + m.variables.currentItem.getDescription();
            }

            const balanceText = `Your balance: \`${m.player.marks}\` ${config.emojis.mark}`;
            description += `\n\n${balanceText}`;

            return game.fastEmbed({
              player: m.player,
              fullSend: false,
              reply: true,
              description,
              title: merchant.getName() + ` (\`${game.titleCase(merchant.category)}\`)`,
            });
          },
        },
      ],
    });

    // Initialise menu based on input
    if (!input) {
      menu.init("listMerchants");
    } else {
      menu.variables.currentMerchant = merchant;
      menu.init("merchant");
    }

    player.unlockCommands(["buy"]);
  },
} as Command;

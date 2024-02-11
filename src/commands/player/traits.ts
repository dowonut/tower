import _ from "lodash";
import { f } from "../../functions/core/index.js";
import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "traits",
  aliases: ["tr"],
  unlockCommands: ["traitup", "traitsrefund"],
  description: "View your traits.",
  category: "player",
  useInCombat: true,
  useInDungeon: true,
  async execute(message, args, player, server) {
    const menu = new game.Menu({
      player,
      variables: { selectedTrait: undefined as PlayerTrait },
      boards: [
        { name: "main", rows: ["traits"], message: "main" },
        { name: "options", rows: ["options"], message: "main" },
      ],
      rows: [
        {
          name: "traits",
          type: "buttons",
          components: (m) => {
            let buttons: Button[] = config.traits.map((x) => {
              const hasPoints = m.player.traitPoints > 0;
              return {
                id: x,
                emoji: config.emojis.traits[x],
                disable: !hasPoints,
                style: hasPoints ? "primary" : "secondary",
                function: async () => {
                  if (m.player.traitPoints > 1) {
                    m.variables.selectedTrait = x;
                    m.switchBoard("options");
                  } else {
                    await game.runCommand("traitup", {
                      discordId: m.player.user.discordId,
                      channel: m.player.channel,
                      server,
                      args: [x],
                    });
                    m.refresh();
                  }
                },
              };
            });
            buttons.push({
              id: "refund",
              style: "danger",
              label: "Refund",
              function: async () => {
                await game.runCommand("traitrefund", {
                  discordId: m.player.user.discordId,
                  channel: m.player.channel,
                  server,
                });
                m.refresh();
              },
            });
            return buttons;
          },
        },
        {
          name: "options",
          type: "buttons",
          components: (m) => [
            {
              id: "1",
              label: "+1",
              style: "success",
              function: async () => {
                await game.runCommand("traitup", {
                  discordId: m.player.user.discordId,
                  channel: m.player.channel,
                  server,
                  args: [m.variables.selectedTrait, "1"],
                });
                m.refresh();
              },
            },
            {
              id: "10",
              label: "+10",
              style: "success",
              function: async () => {
                await game.runCommand("traitup", {
                  discordId: m.player.user.discordId,
                  channel: m.player.channel,
                  server,
                  args: [m.variables.selectedTrait, "10"],
                });
                m.refresh();
              },
            },
            {
              id: "all",
              label: "All",
              style: "success",
              function: async () => {
                await game.runCommand("traitup", {
                  discordId: m.player.user.discordId,
                  channel: m.player.channel,
                  server,
                  args: [m.variables.selectedTrait, "all"],
                });
                m.refresh();
              },
            },
            {
              id: "return",
              board: "main",
              function() {
                m.variables.selectedTrait = undefined;
              },
            },
          ],
        },
      ],
      messages: [
        {
          name: "main",
          function: async (m) => {
            let description = ``;
            // Format embed description
            const useEmoji = m.variables.selectedTrait ? true : false;
            for (const trait of config.traits) {
              const selectEmoji = trait == m.variables.selectedTrait ? "👉" : config.emojis.blank;
              description += useEmoji ? selectEmoji : "";
              description += ` ${config.emojis.traits[trait]} ${game.titleCase(trait)}: ${f(
                m.player[trait]
              )} | ${config.traitInfo[trait]}\n`;
            }
            // Remind player of stat points
            if (m.player.traitPoints > 0)
              description += `\n**You have ${f(m.player.traitPoints)} trait points available.**`;
            const title = `Traits`;
            return game.fastEmbed({
              player: m.player,
              fullSend: false,
              description,
              title,
            });
          },
        },
      ],
    });

    menu.init("main");

    // // Get stats embed
    // const embed = getEmbed(player);
    // // Store selected stat
    // let selectedStat;
    // const statButtons = getStatButtons(player);
    // // Create component row
    // const row = game.actionRow("buttons", statButtons);
    // // Create stat point assignment buttons
    // /** @type {ComponentButton[]} */
    // const assignButtons = [
    //   {
    //     id: "one",
    //     style: "success",
    //     label: "+1",
    //     stop: true,
    //     function: async (reply, i) => {
    //       await reply.edit({ components: [row] });
    //       return await statUp(selectedStat, 1);
    //     },
    //   },
    //   {
    //     id: "all",
    //     style: "success",
    //     label: "All",
    //     stop: true,
    //     function: async (reply, i) => {
    //       await reply.edit({ components: [row] });
    //       return await statUp(selectedStat, player.statpoints);
    //     },
    //   },
    //   game.returnButton(row),
    // ];
    // const assignRow = game.actionRow("buttons", assignButtons);
    // // Send embed
    // const reply = await game.send({
    //   message,
    //   embeds: [embed],
    //   components: [row],
    // });
    // // Create collector
    // await game.componentCollector(message, reply, statButtons);
    // // Level up stat
    // async function statUp(stat, quantity) {
    //   // Run stat up command
    //   await game.runCommand("statup", {
    //     message,
    //     args: [stat, "$", quantity],
    //     server,
    //   });
    //   // Refresh player data
    //   player = await player.refresh();
    //   // Refresh embed data
    //   const embed = getEmbed(player);
    //   // Update stat buttons
    //   const statButtons = getStatButtons(player);
    //   const row = game.actionRow("buttons", statButtons);
    //   // Edit message
    //   await reply.edit({ components: [row], embeds: [embed] });
    // }
    // // Switch to assign button menu
    // async function assignMenu() {
    //   await reply.edit({ components: [assignRow] });
    //   await game.componentCollector(message, reply, assignButtons);
    // }
    // // Generate stat buttons
    // function getStatButtons(player) {
    //   // Check stat points
    //   const disable = player.statpoints > 0 ? false : true;
    //   // Create stat buttons
    //   /** @type {ComponentButton[]} */
    //   let statButtons = [];
    //   for (const stat of config.stats) {
    //     statButtons.push({
    //       id: stat,
    //       emoji: config.emojis.stats[stat],
    //       disable: disable,
    //       async function(reply, i) {
    //         selectedStat = i.customId;
    //         if (player.statpoints > 1) {
    //           return await assignMenu();
    //         } else {
    //           return await statUp(selectedStat, 1);
    //         }
    //       },
    //     });
    //   }
    //   return statButtons;
    // }
    // // Generate embed
    // function getEmbed(player) {
    //   let description = ``;
    //   // Format embed description
    //   for (const stat of config.stats) {
    //     description += `${config.emojis.stats[stat]} ${game.titleCase(
    //       stat
    //     )}: \`${player[stat]}\` | *${config.statInfo[stat]}*\n`;
    //   }
    //   // Remind player of stat points
    //   if (player.statpoints > 0)
    //     description += `\n**You have \`${player.statpoints}\` stat points available.**`;
    //   // Create embed
    //   let embed = {
    //     title: `Stats`,
    //     thumbnail: { url: player.pfp },
    //     description: description,
    //     color: config.botColor,
    //   };
    //   return embed;
    // }
  },
} satisfies Command;

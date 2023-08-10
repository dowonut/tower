import { f } from "../../functions/core/index.js";
import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "traits",
  aliases: ["tr"],
  description: "Check your traits.",
  category: "player",
  useInCombat: true,
  async execute(message, args, player, server) {
    const menu = new game.Menu({
      player,
      variables: { selectedTrait: undefined as PlayerTrait },
      boards: [{ name: "main", rows: ["traits"], message: "main" }],
      rows: [
        {
          name: "traits",
          type: "buttons",
          components: (m) => {
            return config.traits.map((x) => {
              const hasPoints = m.player.traitPoints > 0;
              return {
                id: x,
                emoji: config.emojis.traits[x],
                disable: !hasPoints,
                style: hasPoints ? "primary" : "secondary",
                function: async () => {
                  await game.runCommand("traitup", {
                    message,
                    server,
                    args: [x],
                  });
                  m.refresh();
                },
              };
            });
          },
        },
      ],
      messages: [
        {
          name: "main",
          function: async (m) => {
            let description = ``;
            // Format embed description
            for (const trait of config.traits) {
              description += `${config.emojis.traits[trait]} ${game.titleCase(trait)}: ${f(m.player[trait])} | ${
                config.traitInfo[trait]
              }\n`;
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

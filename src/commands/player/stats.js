export default {
  name: "stats",
  aliases: ["s"],
  arguments: "",
  description: "Check your current stats.",
  category: "Player",
  useInCombat: true,
  async execute(message, args, prisma, config, player, game, server, client) {
    // Get stats embed
    const embed = getEmbed(player);

    // Store selected stat
    let selectedStat;

    const statButtons = getStatButtons(player);
    // Create component row
    const row = game.actionRow("buttons", statButtons);

    // Create stat point assignment buttons
    const assignButtons = [
      {
        id: "one",
        style: "success",
        label: "+1",
        stop: true,
        function: async (reply, i) => {
          await i.update({ components: [row] });
          return await statUp(selectedStat, 1);
        },
      },
      {
        id: "all",
        style: "success",
        label: "All",
        stop: true,
        function: async (reply, i) => {
          await i.update({ components: [row] });
          return await statUp(selectedStat, player.statpoints);
        },
      },
      game.returnButton(row),
    ];
    const assignRow = game.actionRow("buttons", assignButtons);

    // Send embed
    const reply = await game.sendEmbed(message, embed, undefined, [row]);

    // Create collector
    await game.componentCollector(message, reply, statButtons);

    // Level up stat
    async function statUp(stat, quantity) {
      // Run stat up command
      await game.runCommand(
        "statup",
        client,
        message,
        [stat, "$", quantity],
        prisma,
        game,
        server
      );
      // Refresh player data
      player = await player.refresh(message, game);

      // Refresh embed data
      const embed = getEmbed(player);

      // Update stat buttons
      const statButtons = getStatButtons(player);
      const row = game.actionRow("buttons", statButtons);

      // Edit message
      await reply.edit({ components: [row], embeds: [embed] });
    }

    // Switch to assign button menu
    async function assignMenu() {
      await reply.edit({ components: [assignRow] });
      await game.componentCollector(message, reply, assignButtons);
    }

    // Generate stat buttons
    function getStatButtons(player) {
      // Check stat points
      const disable = player.statpoints > 0 ? false : true;
      // Create stat buttons
      let statButtons = [];
      for (const stat of config.stats) {
        statButtons.push({
          id: stat,
          emoji: config.emojis.stats[stat],
          disable: disable,
          async function(reply, i) {
            await i.deferUpdate();
            selectedStat = i.customId;
            if (player.statpoints > 1) {
              return await assignMenu();
            } else {
              return await statUp(selectedStat);
            }
          },
        });
      }
      return statButtons;
    }

    // Generate embed
    function getEmbed(player) {
      let description = ``;
      // Format embed description
      for (const stat of config.stats) {
        description += `${config.emojis.stats[stat]} ${game.titleCase(
          stat
        )}: \`${player[stat]}\` | *${config.statInfo[stat]}*\n`;
      }

      // Remind player of stat points
      if (player.statpoints > 0)
        description += `\n**You have \`${player.statpoints}\` stat points available.**`;

      // Create embed
      let embed = {
        title: `Stats`,
        thumbnail: { url: player.pfp },
        description: description,
        color: config.botColor,
      };

      return embed;
    }
  },
};

import { game, config, prisma, client } from "../tower.js";

export default {
  name: "profile",
  description: "Show all relevant information about your character.",
  aliases: ["pr", "p"],
  //  category: "General",
  useInCombat: true,
  async execute(message, args, player, server) {
    if (args[0] && args[0].startsWith("<@")) {
      const user = message.mentions.users.first();

      // fetch player data when pinging
      if (user) {
        player = await game.getPlayer({
          discordId: user.id,
          server: server,
          message: message,
        });

        if (!player)
          return game.error({
            message,
            content: "this user has no character.",
          });
      }
    }

    const { embedVariable: format } = game;

    // define all variables
    const { level, xp, health, maxHealth, floor, marks } = player;
    const nextXp = config.nextLevelXp(level);
    const {
      health: healthE,
      floor: floorE,
      mark: markE,
      blank,
    } = config.emojis;
    const region = game.titleCase(player.getRegion().name);
    const { strength, defence, arcane, vitality } = config.emojis.stats;
    const { strength: ps, defence: pd, arcane: pa, vitality: pv } = player;

    let description = ``;
    // Add level
    description += `\nLevel: ${format(level)}`;
    // Add xp and xp bar
    description += `\n${game.progressBar(xp, nextXp, "xp")}`;
    description += `\nXP: ${format(`${xp} / ${nextXp}`)}`;
    // Add health
    description += `\n\n${game.progressBar(health, maxHealth, "health")}`;
    description += `\n${healthE} ${format(health + " / " + maxHealth)}`;
    // Add marks
    description += `\n\n${markE} Marks: ${format(marks)}`;
    // Add floor and region
    description += `\n\n${floorE} Floor: ${format(floor)} | ${format(region)}`;
    // Add stats
    if (player.level > 0) {
      description += `\n\n${strength} ${format(ps)} ${defence} ${format(
        pd
      )} ${arcane} ${format(pa)} ${vitality} ${format(pv)}`;
    }

    // Check if player is currently in combat
    if (player.inCombat == true)
      description += `\n\n:dagger: **Currently in combat.**\n`;

    // Check if player has unused stat points
    if (player.statpoints > 0)
      description += `\n\n:low_brightness: **You have \`${player.statpoints}\` unassigned stat points! \n${config.emojis.blank} Check your stats with \`${server.prefix}stats\`**`;

    // Create embed
    const color = player.user.embed_color;
    const embed = {
      color: parseInt("0x" + color),
      author: {
        name: player.username + "#" + player.discriminator,
      },
      thumbnail: {
        url: player.pfp,
      },
      description: description,
    };

    // Unlock new commands
    player.unlockCommands(message, server, [
      "inventory",
      "equipment",
      "region",
    ]);

    // Check if player is same as the message author
    const playerIsAuthor = player.discordId == message.author.id;
    let sentInventory = false;
    let sentEquipment = false;

    // Get buttons for inventory and equipment
    const buttons = getButtons();
    const row = game.actionRow("buttons", buttons);

    // Send embed
    const reply = await game.send({
      message,
      embeds: [embed],
      components: [row],
    });

    // Create collector
    game.componentCollector(message, reply, buttons);

    // Function to get buttons
    function getButtons() {
      /** @type {ComponentButton[]} */
      const buttons = [
        {
          id: "inventory",
          label: "Inventory",
          disable: !playerIsAuthor || sentInventory ? true : false,
          function: () => {
            sentInventory = true;
            updateButtons();
            return game.runCommand("inventory", { message, server });
          },
        },
        {
          id: "equipment",
          label: "Equipment",
          disable: !playerIsAuthor || sentEquipment ? true : false,
          function: () => {
            sentEquipment = true;
            updateButtons();
            return game.runCommand("inventory", { message, server });
          },
        },
      ];
      return buttons;
    }

    // Function to update buttons
    function updateButtons() {
      const buttons = getButtons();

      const row = game.actionRow("buttons", buttons);

      reply.edit({ components: [row] });
    }
  },
};

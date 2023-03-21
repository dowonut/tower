import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "status",
  aliases: ["st"],
  description: "Show your current status during combat.",
  category: "combat",
  useInCombatOnly: true,
  async execute(message, args, player, server) {
    const enemy = await player.getCurrentEnemy();

    const embed = {
      color: config.botColor,
      author: {
        //icon_url: player.pfp,
        name: `${player.username} (fighting ${enemy.name})`,
      },
      thumbnail: {
        url: player.pfp,
      },
      description: `
:drop_of_blood: Health: **\`${player.health} / ${player.maxHealth}\`**
      `,
    };

    game.send({ message, embeds: [embed] });
  },
};

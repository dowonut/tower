import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "status",
  aliases: ["st"],
  description: "Show your current status during combat.",
  category: "combat",
  useInCombatOnly: true,
  async execute(message, args, player, server) {
    const enemies = await player.getEnemies();
    const enemy = enemies[0];

    const title = `${player.user.username} (fighting ${enemy.name})`;
    const embed = {
      thumbnail: {
        url: player.user.pfp,
      },
      description: game.fastProgressBar("health", player),
    };

    game.fastEmbed({ message, player, title, embed: embed });
  },
} as Command;

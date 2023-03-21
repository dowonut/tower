import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "enemyinfo",
  aliases: ["ei"],
  description: "Get information about an enemy during combat.",
  category: "combat",
  useInCombatOnly: true,
  async execute(message, args, player, server) {
    const { embed, image } = await game.enemyInfo(config, player);

    game.fastEmbed(message, player, embed, embed.author.name, image);
  },
};

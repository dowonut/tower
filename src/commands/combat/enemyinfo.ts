import { game, config, client, prisma } from "../../tower.js";

/** @type {Command} */
export default {
  name: "enemyinfo",
  aliases: ["ei"],
  description: "View information about an enemy during combat.",
  category: "combat",
  useInCombatOnly: true,
  async execute(message, args, player, server) {},
} as Command;

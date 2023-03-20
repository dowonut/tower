import { game, config, prisma, client } from "../../tower.js";

/** @type {Command} */
export default {
  name: "test",
  aliases: ["te"],
  arguments: "",
  description: "For testing purposes.",
  category: "admin",
  async execute(message, args, player, server) {},
};

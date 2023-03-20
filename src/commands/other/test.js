import { game, config, prisma, client } from "../../tower.js";

export default {
  name: "test",
  aliases: ["te"],
  arguments: "",
  description: "For testing purposes.",
  category: "Admin",
  async execute(message, args, player, object) {
    const embed = { description: "hi", color: config.towerColor };

    game.send({ message, content: "hi", embeds: [embed] });
    game.error({ message, content: "boo!" });
  },
};

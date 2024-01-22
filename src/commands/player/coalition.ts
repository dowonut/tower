import { AttachmentBuilder } from "discord.js";
import { game } from "../../tower.js";

export default {
  name: "coalition",
  aliases: ["c"],
  description: "",
  category: "player",
  async execute(message, args, player, server) {
    const coalitionImage = new AttachmentBuilder("./assets/icons/animated/coalition.gif");

    game.fastEmbed({
      player,
      files: [coalitionImage],
      title: "The Coalition",
      thumbnail: "attachment://coalition.gif",
      description: "The Coalition oversees all operations and expeditions within the tower.",
    });
  },
} satisfies Command;

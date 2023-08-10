import { game } from "../../tower.js";

export default {
  name: "patchmissing",
  aliases: ["pm"],
  description: "Check for and patch any missing default attributes.",
  category: "other",
  async execute(message, args, player, server) {
    const patches = await player.checkMissing();

    if (patches.length < 1) {
      return game.send({
        player,
        reply: true,
        content: `Nothing to patch 👍`,
      });
    }

    let text = patches.map((x) => `\`${x}\``).join("\n");

    game.send({
      player,
      reply: true,
      content: `**Patched missing values:**\n${text}`,
    });
  },
} satisfies Command;

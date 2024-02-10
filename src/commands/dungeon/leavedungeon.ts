import { game } from "../../tower.js";

export default {
  name: "leavedungeon",
  aliases: ["ld"],
  description: "Leave your current dungeon.",
  category: "dungeon",
  environment: ["dungeon"],
  async execute(message, args, player, server) {
    game.send({
      player,
      reply: true,
      content: `You left **${game.titleCase(player.dungeon.name)}**`,
    });

    await player.update({ dungeon: { delete: {} }, environment: "world" });
  },
} satisfies Command;

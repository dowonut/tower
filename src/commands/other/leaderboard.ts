import { game, config, client, prisma } from "../../tower.js";

export default {
  name: "leaderboard",
  aliases: ["top", "lb"],
  arguments: [{ name: "category", required: false }],
  description: "Get top 10 leaderboard for any category.",
  category: "other",
  async execute(message, args, player, server) {
    console.log("leaderboard");
  },
} satisfies Command;

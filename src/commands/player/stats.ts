import { game } from "../../tower.js";

export default {
  name: "stats",
  aliases: ["s"],
  description: "See all of your stats.",
  category: "player",
  async execute(message, args, player, server) {
    const obj = player.getStats();
    let description = ``;
    let title = `Stats`;

    for (let [stat, value] of Object.entries(obj)) {
      if (stat == "maxHP") stat = "HP";
      let percent = ``;
      if (["CR", "CD", "AR", "AD"].includes(stat)) percent = ` %`;
      description += `${stat}: **\`${value}${percent}\`**\n`;
    }

    game.fastEmbed({ message, player, description, title });
  },
} satisfies Command;

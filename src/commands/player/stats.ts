import { f } from "../../functions/core/index.js";
import { config, game } from "../../tower.js";

export default {
  name: "stats",
  aliases: ["s"],
  description: "View all your stats.",
  arguments: [{ name: "user", type: "user", required: false }],
  category: "player",
  useInCombat: true,
  async execute(message, args: { user: Player }, player, server) {
    if (args.user) {
      player = args.user;
    }

    let description = ``;
    let title = `${player.user.username}'s Stats`;

    for (let statName of Object.keys(config.baseStats) as PlayerStat[]) {
      const { stats } = config.emojis;
      const baseStat = player.getBaseStat(statName);
      const { weaponLevelBonus } = player.getStat(statName, true);
      let name: string = statName;
      if (statName == "maxHP") name = "HP";
      let percent = ``;
      if (["CR", "CD", "AR", "AD"].includes(name)) percent = `%`;

      const base = baseStat + percent;
      const weapon = "+" + weaponLevelBonus;

      description += `\n${stats[statName]} ${game.titleCase(name)}: ${f(base)}`;

      if (weaponLevelBonus) description += ` ${f(weapon)}`;
    }

    game.fastEmbed({ player, description, title, thumbnail: player.user.pfp, reply: false });
  },
} satisfies Command;

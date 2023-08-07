import { f } from "../../functions/core/index.js";
import { config, game } from "../../tower.js";

export default {
  name: "stats",
  aliases: ["s"],
  description: "See all of your stats.",
  category: "player",
  useInCombat: true,
  async execute(message, args, player, server) {
    let description = ``;
    let title = `Stats`;

    for (let statName of Object.keys(config.baseStats) as PlayerStat[]) {
      const { baseStat, levelBonus, weaponLevelBonus } = player.getStat(statName, true);
      let name: string = statName;
      if (statName == "maxHP") name = "HP";
      let percent = ``;
      if (["CR", "CD", "AR", "AD"].includes(name)) percent = `%`;

      const base = baseStat + levelBonus + percent;
      const weapon = "+" + weaponLevelBonus + percent;

      description += `\n${name}: ${f(base)}`;

      if (weaponLevelBonus) description += ` ${f(weapon)}`;
    }

    game.fastEmbed({ message, player, description, title });
  },
} satisfies Command;

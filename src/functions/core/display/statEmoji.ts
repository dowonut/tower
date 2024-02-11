import { config, game } from "../../../tower.js";

/** Get stat emoji */
export default function statEmoji(stat: Stat_) {
  if (stat in config.baseStats) {
    return config.emojis.stats[stat];
  } else if (stat in config.baseStatsDamage) {
    return config.emojis.damage[stat.split("_")[0]];
  } else if (stat in config.baseStatsResistance) {
    return config.emojis.stats.RES + config.emojis.damage[stat.split("_")[0]];
  }
}

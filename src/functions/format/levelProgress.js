import * as config from "../../config.js";

export default {
  levelProgress: (player, xp) => {
    let playerXp = xp ? player.xp + xp : player.xp;

    return game.progressBar(playerXp, config.nextLevelXp(player.level), "xp");
  },
};
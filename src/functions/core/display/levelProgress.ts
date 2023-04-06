import { game, config } from "../../../tower.js";

export default function levelProgress(player: Player, xp: number) {
  let playerXp = xp ? player.xp + xp : player.xp;

  return game.progressBar(playerXp, config.nextLevelXp(player.level), "xp");
}

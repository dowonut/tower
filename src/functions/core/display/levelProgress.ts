import { game, config } from "../../../tower.js";

export default function levelProgress(player: Player, xp: number) {
  let playerXp = xp ? player.xp + xp : player.xp;

  return game.progressBar({
    min: playerXp,
    max: config.nextLevelXp(player.level),
    type: "green",
  });
}

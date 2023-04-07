import { game, config } from "../../../tower.js";

type ProgressBar = "health" | "xp";

/** Generate progress bar from template. */
export default function fastProgressBar(type: ProgressBar, player: Player) {
  let min: number;
  let max: number;
  let progressBarText: string;
  const { emojis } = config;

  switch (type) {
    case "health":
      min = player.health;
      max = player.maxHealth;
      progressBarText =
        config.emojis.health +
        ` **\`${player.health} / ${player.maxHealth}\`**`;
      break;
    case "xp":
      const nextXp = config.nextLevelXp(player.level);
      min = player.xp;
      max = nextXp;
      progressBarText = `XP: **\`${player.xp} / ${nextXp}\`**`;
      break;
  }

  const progressBar = game.progressBar(min, max, type);

  const finalText = progressBar + "\n" + progressBarText;

  return finalText;
}

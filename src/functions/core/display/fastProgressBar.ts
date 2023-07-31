import { game, config } from "../../../tower.js";

type ProgressBar = "health" | "xp";

/** Generate progress bar from template. */
export default function fastProgressBar(type: ProgressBar, player: Player) {
  let min: number;
  let max: number;
  let color: ProgressBarColor;
  let progressBarText: string;
  const { emojis } = config;

  switch (type) {
    case "health":
      min = player.health;
      max = player.maxHealth;
      color = "red";
      progressBarText =
        config.emojis.health +
        ` **\`${player.health} / ${player.maxHealth}\`**`;
      break;
    case "xp":
      const nextXp = config.nextLevelXp(player.level);
      min = player.xp;
      max = nextXp;
      color = "green";
      progressBarText = `
Level: **\`${player.level}\`**
XP: **\`${player.xp} / ${nextXp}\`**`;
      break;
  }

  const progressBar = game.progressBar({ min, max, type: color });

  const finalText = progressBarText + "\n" + progressBar;

  return finalText;
}

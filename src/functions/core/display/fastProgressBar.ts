import { game, config } from "../../../tower.js";

type ProgressBar = "health" | "xp";

/** Generate progress bar from template. */
export default function fastProgressBar(
  type: ProgressBar,
  entity: Player | Enemy
) {
  let min: number;
  let max: number;
  let color: ProgressBarColor;
  let progressBarText: string;
  const { emojis } = config;

  switch (type) {
    case "health":
      min = entity.health || entity.maxHP;
      max = entity.maxHP;
      color = "red";
      progressBarText = config.emojis.health + ` **\`${min} / ${max}\`**`;
      break;
    case "xp":
      const nextXp = config.nextLevelXp(entity.level);
      min = entity.xp;
      max = nextXp;
      color = "green";
      progressBarText = `
Level: **\`${entity.level}\`**
XP: **\`${min} / ${max}\`**`;
      break;
  }

  const progressBar = game.progressBar({ min, max, type: color });

  const finalText = progressBarText + "\n" + progressBar;

  return finalText;
}

import { game, config } from "../../../tower.js";
import { loadImage, FontLibrary } from "skia-canvas";
import { Canvas } from "skia-canvas";
import { AttachmentBuilder } from "discord.js";

FontLibrary.use("Silkscreen", ["assets/fonts/silkscreen/*.ttf"]);

/** Create an image for enemy encounters. */
export default async function createEncounterImage(object: {
  enemies: Enemy[];
  verbose?: boolean;
  targets?: number[];
}) {
  const { enemies, verbose = false, targets } = object;

  const width = enemies.length <= 4 ? 640 : 160 * enemies.length;
  const height = verbose ? 220 : 160;

  const heightOffset = verbose ? 20 : 0;

  const canvas = new Canvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const tempCanvas = new Canvas(160 * enemies.length, height);
  const tempCtx = tempCanvas.getContext("2d");

  tempCtx.imageSmoothingEnabled = false;
  tempCtx.font = "16px Silkscreen";

  for (const [i, enemy] of enemies.entries()) {
    const image = await loadImage(enemy.getImagePath());
    if (enemy.dead) {
      tempCtx.filter = "grayscale(100%)";
    }
    // Draw enemy image
    tempCtx.drawImage(image, 160 * i, heightOffset, 160, 160);
    // Draw text
    const enemyName = enemy.displayName;
    const textY = 160 * i + 80;
    tempCtx.textBaseline = "top";
    tempCtx.textAlign = "center";
    tempCtx.strokeStyle = "black";
    tempCtx.lineWidth = 4;
    tempCtx.fillStyle = "white";
    tempCtx.strokeText(enemyName, textY, 0);
    tempCtx.fillText(enemyName, textY, 0);
    // Draw health bar
    tempCtx.filter = "none";
    if (verbose) {
      tempCtx.fillStyle = "#1a1a1a";
      tempCtx.fillRect(160 * i + 10, 200, 140, 10);
      tempCtx.fillStyle = "#ff3838";
      tempCtx.fillRect(
        160 * i + 10,
        200,
        Math.floor((Math.max(enemy.health, 0) / enemy.maxHP) * 140),
        10
      );
    }
    // Draw select arrow
    if (verbose && targets.includes(enemy.number)) {
      const arrow = await loadImage("./assets/icons/selection_arrow.png");
      tempCtx.drawImage(arrow, 160 * i, 0);
    }
  }

  ctx.drawCanvas(tempCanvas, (width - tempCanvas.width) / 2, 0);

  const finalRenderedImage = await canvas.png;

  // Create Discord attachment
  const attachment = new AttachmentBuilder(finalRenderedImage, {
    name: `encounter.png`,
  });

  return attachment;
}

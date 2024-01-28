import { game, config } from "../../../tower.js";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import type { Image, Canvas, SKRSContext2D } from "@napi-rs/canvas";
import { AttachmentBuilder } from "discord.js";

/** Create an image for enemy encounters. */
export default async function createEncounterImage(object: {
  enemies: Enemy[];
  verbose?: boolean;
  selectedEnemy?: number;
}) {
  const { enemies, verbose = false, selectedEnemy } = object;

  const width = 640;
  const height = verbose ? 220 : 160;

  const heightOffset = verbose ? 20 : 0;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const tempCanvas = createCanvas(160 * enemies.length, height);
  const tempCtx = tempCanvas.getContext("2d");

  for (const [i, enemy] of enemies.entries()) {
    const image = await loadImage(enemy.getImagePath());
    if (enemy.dead) {
      tempCtx.filter = "grayscale(100%)";
    }
    tempCtx.drawImage(image, 160 * i, heightOffset, 160, 160);
    tempCtx.filter = "none";
    if (verbose) {
      tempCtx.fillStyle = "#1a1a1a";
      tempCtx.fillRect(160 * i + 10, 200, 140, 10);
      tempCtx.fillStyle = "#ff3838";
      tempCtx.fillRect(160 * i + 10, 200, Math.floor((Math.max(enemy.health, 0) / enemy.maxHP) * 140), 10);
    }
    if (verbose && selectedEnemy && enemy.number == selectedEnemy) {
      const arrow = await loadImage("./assets/icons/selection_arrow.png");
      tempCtx.drawImage(arrow, 160 * i, 0);
    }
  }

  ctx.drawImage(tempCanvas, (width - tempCanvas.width) / 2, 0);

  const finalRenderedImage = await canvas.encode("png");

  // Create Discord attachment
  const attachment = new AttachmentBuilder(finalRenderedImage, {
    name: `encounter.png`,
  });

  return attachment;
}

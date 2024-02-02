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

  const width = enemies.length <= 3 ? 160 * 3 : 160 * enemies.length;
  const height = verbose ? 260 : 200;

  const heightOffset = verbose ? 60 : 40;

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
    // Draw name
    const enemyName = enemy.getName();
    const textX = 160 * i + 80;
    tempCtx.textBaseline = "top";
    tempCtx.textAlign = "center";
    tempCtx.strokeStyle = "black";
    tempCtx.lineWidth = 4;
    tempCtx.fillStyle = enemy.dead ? "#9c9c9c" : "white";
    tempCtx.strokeText(enemyName, textX, 0);
    tempCtx.fillText(enemyName, textX, 0);
    // Draw level
    const enemyLevel = `Lvl. ${enemy.level}`;
    tempCtx.fillStyle = "#9c9c9c";
    tempCtx.strokeText(enemyLevel, textX, 16);
    tempCtx.fillText(enemyLevel, textX, 16);
    tempCtx.fillStyle = "white";
    // Draw health bar
    tempCtx.filter = "none";
    if (verbose) {
      // Draw health bar
      tempCtx.fillStyle = "#212121";
      tempCtx.fillRect(160 * i + 10, heightOffset + 170, 140, 10);
      tempCtx.fillStyle = "#000000";
      tempCtx.lineWidth = 2;
      tempCtx.strokeRect(160 * i + 10 - 1, heightOffset + 170 - 1, 140 + 2, 10 + 2);
      tempCtx.fillStyle = enemy.dead ? "#9c9c9c" : "#ed3f3f";
      tempCtx.lineWidth = 4;
      tempCtx.fillRect(
        160 * i + 10,
        heightOffset + 170,
        Math.floor((Math.max(enemy.health, 0) / enemy.maxHP) * 140),
        10
      );
      // Draw health text
      const healthText = `${Math.max(enemy.health, 0)}/${enemy.maxHP}`;
      tempCtx.strokeText(healthText, textX, heightOffset + 180);
      tempCtx.fillText(healthText, textX, heightOffset + 180);
    }
    // Draw select arrow
    if (verbose && targets.includes(enemy.number)) {
      const arrow = await loadImage("./assets/icons/selection_arrow.png");
      tempCtx.drawImage(arrow, 160 * i, heightOffset - 20);
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

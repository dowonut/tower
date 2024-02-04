import { AttachmentBuilder } from "discord.js";
import { game } from "../../tower.js";
import { Canvas, loadImage } from "skia-canvas";

/** Create the player's character image with the current region background. */
export default (async function () {
  const imagePath = (await this.getCharacterImage({ returnPath: true })) as string;
  const regionPath = game.getRegionImage({ name: this.region, returnPath: true }) as string;
  const canvas = new Canvas(320, 320);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const background = await loadImage(regionPath);
  ctx.drawImage(background, 0, 0);
  ctx.shadowColor = "#00000040";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 10;
  const character = await loadImage(imagePath);
  ctx.drawImage(character, 0, 0);

  const finalImage = await canvas.png;

  const attachment = new AttachmentBuilder(finalImage, { name: "character.png" });
  return attachment;
} satisfies PlayerFunction);

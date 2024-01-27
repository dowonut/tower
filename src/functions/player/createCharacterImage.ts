import { game } from "../../tower.js";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import type { Image, Canvas, SKRSContext2D } from "@napi-rs/canvas";
import { AttachmentBuilder } from "discord.js";
import fs from "fs";

const path = "./assets/character/";

type ImageCategory = "hair" | "torso" | "legs" | "feet" | "background";

/** Generate a character image based on input parameters. */
export default (async function (data: PlayerWardrobe) {
  const canvas = createCanvas(320, 320);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  // Draw layers
  await drawImage(ctx, { category: "background", name: "cave" });
  await drawImage(ctx, { name: "body", color: data.skin });
  await drawImage(ctx, { name: "eyes_whites" });
  await drawImage(ctx, { name: "eyes_pupils", color: data.eyes });
  if (data.hair && data.hair.name !== "nothing")
    await drawImage(ctx, { category: "hair", name: data.hair.name, color: data.hair.color });
  if (data.torso && data.torso.name !== "nothing")
    await drawImage(ctx, { category: "torso", name: data.torso.name, color: data.torso.color });
  if (data.legs && data.legs.name !== "nothing")
    await drawImage(ctx, { category: "legs", name: data.legs.name, color: data.legs.color });
  if (data.feet && data.feet.name !== "nothing")
    await drawImage(ctx, { category: "feet", name: data.feet.name, color: data.feet.color });

  const finalRenderedImage = await canvas.encode("png");
  fs.writeFileSync(`./static/characters/${this.user.discordId}.png`, finalRenderedImage);

  // Create Discord attachment
  const attachment = new AttachmentBuilder(finalRenderedImage, {
    name: `${this.user.discordId}.png`,
  });

  return attachment;
} satisfies PlayerFunction);

//---------------------------------------------------
/** Load an image given name and optional category. */
async function getImage(name: string, category?: ImageCategory) {
  let fullPath: string;
  if (category) {
    fullPath = `${category}/${name}.png`;
  } else {
    fullPath = `${name}.png`;
  }

  let image: Image;
  try {
    image = await loadImage(path + fullPath);
  } catch (err) {
    return;
  }
  return image;
}

//---------------------------------------------------
/** Draws and returns a canvas with an image with an overlaid multiply color. */
async function getImageCanvas(args: {
  name: string;
  color?: string;
  category?: ImageCategory;
  /** Type of blend mode to use for color overlay. */
  blendMode?: GlobalCompositeOperation;
}) {
  const { name, color = "white", category, blendMode = "multiply" } = args;

  const canvas = createCanvas(320, 320);
  const ctx = canvas.getContext("2d");

  // Draw image with color overlay
  if (color !== "white") {
    // Draw base image and overlay color using multiply
    const baseImage = await getImage(name, category);
    if (!baseImage) return;
    ctx.drawImage(baseImage, 0, 0);
    ctx.globalCompositeOperation = blendMode;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save colored image and overlay over base image again to remove background
    const coloredImageURL = canvas.toDataURL();
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseImage, 0, 0);
    ctx.globalCompositeOperation = "source-atop";
    const coloredImage = await loadImage(coloredImageURL);
    ctx.drawImage(coloredImage, 0, 0);
  }
  // Draw plain image
  else {
    const baseImage = await getImage(name, category);
    if (!baseImage) return;
    ctx.drawImage(baseImage, 0, 0);
  }
  return canvas;
}

//---------------------------------------------------
/** Draw an image onto the canvas. */
async function drawImage(
  ctx: SKRSContext2D,
  args: {
    name: string;
    color?: string;
    category?: ImageCategory;
    blendMode?: GlobalCompositeOperation;
  }
) {
  const { name, color, category, blendMode } = args;
  let image: Canvas | Image;

  // Get and draw image on canvas
  image = await getImageCanvas({ name, color, category, blendMode });
  ctx.drawImage(image, 0, 0);

  // Reset composite type
  ctx.globalCompositeOperation = "source-over";
}

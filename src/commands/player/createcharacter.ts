import { createCanvas, loadImage } from "canvas";
import type { CanvasRenderingContext2D, Image, Canvas } from "canvas";
import { AttachmentBuilder } from "discord.js";
import { game } from "../../tower.js";

const path = "./assets/character/";

type ImageCategory = "hair" | "torso" | "legs" | "shadow";

const defaultSkinColor = "#f6c9ac";

export default {
  name: "createcharacter",
  aliases: ["cc"],
  description: "Create a new character design.",
  dev: true,
  category: "player",
  async execute(message, args, player, server) {
    const canvas = createCanvas(640, 640);
    const ctx = canvas.getContext("2d");

    ctx.imageSmoothingEnabled = false;

    await drawImage(ctx, { name: "body_base", color: defaultSkinColor });
    await drawImage(ctx, { name: "body_arms", color: defaultSkinColor });
    await drawImage(ctx, { name: "eyes_base" });
    await drawImage(ctx, {
      name: "eyes_color",
      color: "hsl(300, 50%, 50%)",
      blendMode: "source-over",
    });
    await drawImage(ctx, {
      name: "very_short",
      color: "brown",
      category: "hair",
    });
    //await drawImage(ctx, { name: "afro", category: "shadow" });

    const finalRenderedImage = canvas.toBuffer();

    const attachment = new AttachmentBuilder(finalRenderedImage, {
      name: "image.png",
    });

    const title = `Character Created!`;
    const embed: Embed = {
      image: { url: "attachment://image.png" },
    };

    game.fastEmbed({ message, player, title, embed, files: [attachment] });
  },
} as Command;

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
/** Load an image with an overlaid multiply color. */
async function getImageColor(args: {
  name: string;
  color?: string;
  category?: ImageCategory;
  blendMode?: GlobalCompositeOperation;
}) {
  const { name, color = "white", category, blendMode = "multiply" } = args;

  const canvas = createCanvas(640, 640);
  const ctx = canvas.getContext("2d");

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
  return canvas;
}

async function getImageShadow(args: { name: string }) {
  const { name } = args;
  const baseImage = await getImage(name, "shadow");
  if (!baseImage) return;
  return baseImage;
}

//---------------------------------------------------
/** Draw an image onto the canvas. */
async function drawImage(
  ctx: CanvasRenderingContext2D,
  args: {
    name: string;
    color?: string;
    category?: ImageCategory;
    blendMode?: GlobalCompositeOperation;
  }
) {
  const { name, color, category, blendMode } = args;
  let image: Canvas | Image;
  // Drawing shadow
  if (category == "shadow") {
    image = await getImageShadow({ name: name });
    ctx.globalCompositeOperation = "multiply"; //"soft-light";
    ctx.drawImage(image, 0, 0);
  }
  // Draw shadow if hair
  else if (category == "hair") {
    image = await getImageColor({ name, color, category, blendMode });
    ctx.drawImage(image, 0, 0);
    const imageShadow = await getImageShadow({ name: name });
    if (!imageShadow) return;
    ctx.globalCompositeOperation = "soft-light";
    ctx.drawImage(imageShadow, 0, 0);
  }
  // Draw everything else
  else {
    image = await getImageColor({ name, color, category, blendMode });
    ctx.drawImage(image, 0, 0);
  }

  // Reset composite type
  ctx.globalCompositeOperation = "source-over";
}

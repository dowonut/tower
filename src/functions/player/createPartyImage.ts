import { game, config } from "../../tower.js";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import type { Image, Canvas, SKRSContext2D } from "@napi-rs/canvas";
import { AttachmentBuilder } from "discord.js";

/** Create the party image using player characters. */
export default (async function () {
  const players = this?.party?.players;
  if (!players) return undefined;

  const characterWidth = 110;

  const width = characterWidth * 4;
  const height = 160;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const tempCanvas = createCanvas(characterWidth * players.length, height);
  const tempCtx = tempCanvas.getContext("2d");

  for (const [i, player] of players.entries()) {
    const image = await loadImage(`./static/characters/${this.server.serverId}/${player.user.discordId}.png`);
    tempCtx.drawImage(image, characterWidth * i - 25, 0, 160, 160);
  }

  ctx.drawImage(tempCanvas, (width - tempCanvas.width) / 2, 0);

  const finalRenderedImage = await canvas.encode("png");

  // Create Discord attachment
  const attachment = new AttachmentBuilder(finalRenderedImage, {
    name: `party.png`,
  });

  return attachment;
} satisfies PlayerFunction);

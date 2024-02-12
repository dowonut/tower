import { game } from "../../../tower.js";
import { loadImage, FontLibrary } from "skia-canvas";
import { Canvas } from "skia-canvas";
import { AttachmentBuilder } from "discord.js";

/** Create the dungeon structure image. */
export default async function createDungeonImage(args: { dungeon: Dungeon }) {
  const { dungeon } = args;

  if (!dungeon.structure) return;

  const scale = 3;

  const tilesX = dungeon.structure.length;
  const tilesY = dungeon.structure[0].length;

  const offset = 8 * scale;

  const width = offset * 2 + 16 * tilesX * scale;
  const height = offset * 2 + 16 * tilesY * scale;

  const tileW = 16 * scale;
  const tileH = 16 * scale;

  const canvas = new Canvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  // const background = await loadImage(`./assets/dungeons/background.png`);
  // ctx.drawImage(background, 0, 0, width, height);
  ctx.fillStyle = "#0e0e0e";
  ctx.beginPath();
  ctx.roundRect(2 * scale, 2 * scale, width - 4 * scale, height - 4 * scale, 4 * scale);
  ctx.fill();

  // Get tiles adjacent to the current one
  const adjacentTiles = dungeon.getAdjacentChambers(dungeon.x, dungeon.y);

  // Draw each tile
  for (let realX = 0; realX < tilesX; realX++) {
    for (let realY = 0; realY < tilesY; realY++) {
      // Don't draw empty tiles
      if (dungeon.structure[realX][realY] == 0) continue;
      const x = realX + 1;
      const y = realY + 1;

      let tile: "default" | "unavailable" | "current" | "boss" = "unavailable";

      // Adjacent or discovered tile
      const isAdjacent = adjacentTiles.some((a) => a.x == x && a.y == y);
      const isDiscovered = dungeon.discoveredTiles.some((d) => d.x == x && d.y == y);
      const isCurrent = dungeon.x == x && dungeon.y == y;
      if (isDiscovered) tile = "default";
      // Boss tile
      if (dungeon.structure[realX][realY] == 10) tile = "boss";

      // Draw tile background
      const defaultTile = await loadImage(`./assets/dungeons/tiles/${tile}.png`);
      ctx.drawImage(defaultTile, offset + tileW * realX, offset + tileH * realY, tileW, tileH);

      // Draw current icon
      if (isCurrent) {
        const currentOverlay = await loadImage(`./assets/dungeons/tiles/current.png`);
        ctx.drawImage(currentOverlay, offset + tileW * realX, offset + tileH * realY, tileW, tileH);
      }

      // Draw chamber icon
      let chamber = dungeon.getChamber(x, y);
      if (!isCurrent && !isAdjacent && chamber?.type !== "boss" && !isDiscovered) continue;
      let type = chamber.type;
      const chamberType = await loadImage(`./assets/dungeons/chambers/${type}.png`);
      ctx.drawImage(chamberType, offset + tileW * realX, offset + tileH * realY, tileW, tileH);
    }
  }

  const finalRenderedImage = await canvas.png;

  // Create Discord attachment
  const attachment = new AttachmentBuilder(finalRenderedImage, {
    name: `dungeon.png`,
  });

  return attachment;
}

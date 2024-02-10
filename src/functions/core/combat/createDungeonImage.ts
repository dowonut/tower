import { game } from "../../../tower.js";
import { loadImage, FontLibrary } from "skia-canvas";
import { Canvas } from "skia-canvas";
import { AttachmentBuilder } from "discord.js";

/** Create the dungeon structure image. */
export default async function createDungeonImage(args: { dungeon: Dungeon }) {
  const { dungeon } = args;

  const scale = 2;

  const width = 144 * scale;
  const height = 96 * scale;

  const tileW = 16 * scale;
  const tileH = 16 * scale;

  const offset = 8 * scale;

  const canvas = new Canvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  if (!dungeon.structure) return;

  const background = await loadImage(`./assets/dungeons/background.png`);
  ctx.drawImage(background, 0, 0, width, height);

  // Get tiles adjacent to the current one
  const adjacentTiles = dungeon.getAdjacentChambers(dungeon.x, dungeon.y);

  // Draw each tile
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 5; y++) {
      // Don't draw empty tiles
      if (dungeon.structure[x][y] == 0) continue;

      let tile: "default" | "unavailable" | "current" | "boss" = "unavailable";

      // Adjacent tile
      const isAdjacent = adjacentTiles.some((a) => a.x == x + 1 && a.y == y + 1);
      if (isAdjacent) tile = "default";
      // Current tile
      const isCurrent = dungeon.x == x + 1 && dungeon.y == y + 1;
      if (isCurrent) tile = "current";
      // Boss tile
      if (dungeon.structure[x][y] == 10) tile = "boss";

      // Draw tile background
      const defaultTile = await loadImage(`./assets/dungeons/tiles/${tile}.png`);
      ctx.drawImage(defaultTile, offset + tileW * x, offset + tileH * y, tileW, tileH);

      // Draw chamber icon
      let chamber = dungeon.getChamber(x + 1, y + 1);
      if (!isCurrent && !isAdjacent && chamber.type !== "boss") continue;
      let type = chamber.type;
      if (chamber.type == "boss") type = "combat";
      const chamberType = await loadImage(`./assets/dungeons/chambers/${type}.png`);
      ctx.drawImage(chamberType, offset + tileW * x, offset + tileH * y, tileW, tileH);
    }
  }

  const finalRenderedImage = await canvas.png;

  // Create Discord attachment
  const attachment = new AttachmentBuilder(finalRenderedImage, {
    name: `dungeon.png`,
  });

  return attachment;
}

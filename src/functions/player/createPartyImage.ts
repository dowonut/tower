import { game, config } from "../../tower.js";
import { Canvas, loadImage } from "skia-canvas";
import { AttachmentBuilder } from "discord.js";
import fs from "fs";

/** Create the party image using player characters. */
export default (async function () {
  const players = this?.party?.players;
  if (!players) return undefined;

  const characterWidth = 110;

  const width = characterWidth * 4;
  const height = 160;

  const canvas = new Canvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const tempCanvas = new Canvas(characterWidth * players.length, height);
  const tempCtx = tempCanvas.getContext("2d");

  for (let [i, pPlayer] of players.entries()) {
    const characterPath = `./static/characters/${this.server.serverId}/${pPlayer.user.discordId}.png`;
    if (!fs.existsSync(characterPath)) {
      const pPlayerClass = await game.getPlayer({
        server: this.server,
        channel: this.channel,
        discordId: pPlayer.user.discordId,
      });
      await pPlayerClass.createCharacterImage(pPlayerClass.wardrobe);
    }
    const image = await loadImage(`./static/characters/${this.server.serverId}/${pPlayer.id}.png`);
    tempCtx.drawImage(image, characterWidth * i - 25, 0, 160, 160);
  }

  ctx.drawImage(tempCanvas, (width - tempCanvas.width) / 2, 0);

  const finalRenderedImage = await canvas.png;

  // Create Discord attachment
  const attachment = new AttachmentBuilder(finalRenderedImage, {
    name: `party.png`,
  });

  return attachment;
} satisfies PlayerFunction);

import { game } from "../../tower.js";
import fs from "fs";
import { AttachmentBuilder } from "discord.js";

/** Get the player's character image from local file storage. */
export default (async function () {
  const path = `./static/characters/${this.user.discordId}.png`;

  if (!fs.existsSync(path)) return;

  const file = new AttachmentBuilder(path);

  return file;
} satisfies PlayerFunction);

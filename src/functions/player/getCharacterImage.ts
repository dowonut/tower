import { game } from "../../tower.js";
import fs from "fs";
import { AttachmentBuilder } from "discord.js";

/** Get the player's character image from local file storage. */
export default (async function () {
  const path = `./static/characters/${this.server.serverId}/${this.id}.png`;

  if (!fs.existsSync(path)) {
    await this.createCharacterImage(this?.wardrobe);
  }

  const file = new AttachmentBuilder(path, { name: "character.png" });

  return file;
} satisfies PlayerFunction);

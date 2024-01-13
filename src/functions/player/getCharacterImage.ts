import { game } from "../../tower.js";
import fs from "fs";
import { AttachmentBuilder } from "discord.js";

/** Get the player's character image from local file storage. */
export default (async function () {
  const path = `./assets/player_characters/${this.user.discordId}.png`;

  if (!fs.existsSync(path)) return;

  const file = new AttachmentBuilder(`./assets/player_characters/${this.user.discordId}.png`);

  return file;
} satisfies PlayerFunction);

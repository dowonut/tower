import { TextChannel } from "discord.js";
import { game, config } from "../../../tower.js";

/**
 * Send error message to Discord.
 */
export default async function error(object: { content: string; player: Player }) {
  const { content, player } = object;

  const emoji = config.emojis.red_x;
  let text: string;
  let finalText: string;
  let reply = true;

  // Format text based on whether to reply directly or not
  text = content.charAt(0).toUpperCase() + content.slice(1);

  // Format reply contents
  if (player.isMessageAuthor) {
    finalText = `${emoji} ${text}`;
  } else {
    finalText = `${emoji} ${player.ping} ${content}`;
    reply = false;
  }

  return await game.send({
    player,
    content: finalText,
    reply,
  });
}

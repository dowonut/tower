import { TextChannel } from "discord.js";
import { game, config } from "../../../tower.js";

/**
 * Send error message to Discord.
 */
export default async function error(object: {
  content: string;
  message?: Message;
  channel?: TextChannel;
}) {
  if (!object.content || !object.message) return;

  const { content, message, channel } = object;

  const reply = message.author.id == message.user.discordId;

  const emoji = config.emojis.error;
  let text: string;

  // Format text based on whether to reply directly or not
  if (reply) {
    text = content.charAt(0).toUpperCase() + content.slice(1);
  } else {
    text = `<@${message.user.discordId}> ${content}`;
  }

  // Format reply contents
  const uContent = `${emoji} ${text}`;
  //const uContent = `${config.emojis.error} <@${message.author.id}> ${content}`;

  return await game.send({
    message,
    channel,
    content: uContent,
    reply,
  });
}

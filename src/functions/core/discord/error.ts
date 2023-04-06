import { game, config } from "../../../tower.js";

/**
 * Send error message to Discord.
 */
export default async function error(object: {
  content: string;
  message: Message;
}) {
  if (!object.content || !object.message) return;

  const { content, message } = object;

  // Format reply contents
  const uContent =
    config.emojis.error +
    " " +
    content.charAt(0).toUpperCase() +
    content.slice(1);
  //const uContent = `${config.emojis.error} <@${message.author.id}> ${content}`;

  return await game.send({ message, content: uContent, reply: true });
}

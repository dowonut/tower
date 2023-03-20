import { config } from "../tower.js";

/**
 * Send a messsage to Discord.
 * @param {object} args
 * @param {object} [args.message] - Message args.
 * @param {object} [args.channel] - Channel args.
 * @param {string} [args.content] - Regular message content.
 * @param {object[]} [args.embeds] - Message embeds.
 * @param {object[]} [args.components] - Message components.
 * @param {boolean} [args.ping=false] - Ping the user.
 * @param {boolean} [args.reply=false] - Reply to the user's message.
 */
export default async function send(args) {
  const {
    ping = false,
    reply = false,
    message,
    content,
    embeds,
    components,
  } = args;
  const channel = message ? message.channel : args.channel;

  let messageObject = {
    content: "",
  };

  // Add message content
  if (content) messageObject.content = content;

  // Add components
  if (components) messageObject.components = components;

  // Add embeds
  if (embeds) {
    messageObject.embeds = embeds;

    // Format embeds
    for (let i = 0; i < messageObject.embeds.length; i++) {
      if (!messageObject.embeds[i].color) {
        messageObject.embeds[i].color = config.botColor;
      }
    }
  }

  // Ping user
  if (ping && message) {
    messageObject.content = `<@${message.author.id}> ` + messageObject.content;
  }

  // Reply to message
  let botMsg;
  if (reply && message) {
    botMsg = await message.reply(messageObject);
  }
  // Send new message
  else {
    botMsg = await channel.send(messageObject);
  }

  return botMsg;
}

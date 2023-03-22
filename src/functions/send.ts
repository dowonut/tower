import { config } from "../tower.js";

/**
 * Send a message to discord.
 * @param args
 * @param args.message Message object.
 * @param args.channel Channel object.
 * @param args.ping Ping the user.
 * @param args.reply Reply to the user's message.
 * @param args.content Message content.
 * @param args.embeds Message embeds.
 * @param args.components Message components.
 * @param args.files Message files.
 * @returns Message
 */
export default async function send(args: {
  message?: any;
  channel?: any;
  ping?: any;
  reply?: any;
  content?: any;
  embeds?: any;
  components?: any;
  files?: any;
}): Promise<void> {
  const {
    ping = false,
    reply = false,
    message,
    content,
    embeds,
    components,
    files,
  } = args;
  const channel = message ? message.channel : args.channel;

  let messageObject: any = {
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

  // Add files
  if (files) {
    messageObject.files = files;
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

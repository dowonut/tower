import { MessageCreateOptions, TextChannel } from "discord.js";
import { config } from "../../../tower.js";

/**
 * Send a message to Discord.
 */
export default async function send<B extends boolean = true>(args: {
  message?: Message;
  channel?: TextChannel;
  ping?: boolean;
  reply?: boolean;
  content?: string;
  embeds?: any[];
  components?: any[];
  files?: any[];
  send?: B;
}): Promise<B extends true ? Message : MessageCreateOptions> {
  const {
    ping = false,
    reply = false,
    message,
    content,
    embeds,
    components,
    files,
    send = true,
  } = args;
  const channel = message ? message.channel : args.channel;

  // if (channel.type !== ChannelType.GuildText)
  //   return console.error("Invalid channel type.");

  let messageObject: MessageCreateOptions = {
    content: "",
  };

  // Add message content
  if (content) messageObject.content = content;

  // Add components
  if (components) messageObject.components = components;

  // Add embeds
  if (embeds) {
    // Format embeds
    for (let i = 0; i < embeds.length; i++) {
      if (!embeds[i].color) {
        embeds[i].color = config.botColor;
      }
    }

    messageObject.embeds = embeds;
  }

  // Add files
  if (files) {
    messageObject.files = files;
  }

  // Ping user
  if (ping && message) {
    messageObject.content = `<@${message.author.id}> ` + messageObject.content;
  }

  if (!send) return messageObject as any;

  // Reply to message
  let botMsg: Message<any>;
  if (reply && message) {
    botMsg = await message.reply(messageObject);
  }
  // Send new message
  else {
    botMsg = await channel.send(messageObject);
  }

  return botMsg as any;
}
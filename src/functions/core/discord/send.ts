import {
  MessageCreateOptions,
  MessageEditOptions,
  MessagePayload,
  TextChannel,
} from "discord.js";
import { config } from "../../../tower.js";
import { MessagePayloadOption } from "discord.js";
import { MessageReplyOptions } from "discord.js";

/**
 * Send a message to Discord.
 */
export default async function send<B extends boolean = true>(args: {
  message?: Message;
  /** Optional as backup if message not available. */
  channel?: TextChannel;
  /** Ping the user at the start of the message. Default: false.*/
  ping?: boolean;
  /** Reply to the user's original message. Default: false. */
  reply?: boolean;
  /** Regular message content. */
  content?: string;
  embeds?: Embed[];
  components?: any[];
  files?: any[];
  /** Send the message or return object with message create options. Default: true. */
  send?: B;
}): Promise<B extends true ? Message : MessageOptions> {
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

  let messageObject: MessageOptions = {
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
        embeds[i].color = config.defaultEmbedColor;
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

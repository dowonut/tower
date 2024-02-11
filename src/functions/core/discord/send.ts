import { MessageCreateOptions, MessageEditOptions, MessagePayload, TextChannel } from "discord.js";
import { config } from "../../../tower.js";
import { MessagePayloadOption } from "discord.js";
import { MessageReplyOptions } from "discord.js";
import Discord from "discord.js";

/**
 * Send a message to Discord.
 */
export default async function send<B extends boolean = true>(args: {
  player: Player;
  /** Ping the user at the start of the message. Default: false.*/
  ping?: boolean;
  /** Reply to the user's original message. Default: false. */
  reply?: boolean;
  /** Regular message content. */
  content?: string;
  embeds?: Embed[];
  components?: any[];
  files?: DiscordAttachment[];
  /** Send the message or return object with message create options. Default: true. */
  send?: B;
  /** Ping all members of the party in the message. Default: false. */
  pingParty?: boolean;
}): Promise<B extends true ? Message : MessageOptions> {
  const {
    ping = false,
    reply = false,
    player,
    content,
    embeds,
    components,
    files,
    send = true,
    pingParty = false,
  } = args;
  const channel = player.channel;
  const message = player.message;
  const shouldReply = message?.author?.id == player.user.discordId;

  // console.log("CHANNEL: ", channel ? true : false);
  // console.log("MESSAGE: ", message ? true : false);
  // console.log("REPLY: ", reply ? true : false);
  // console.log("SHOULD REPLY: ", reply ? true : false);
  // console.log("====================================");

  if (!channel) {
    throw new Error("No channel provided in send function.");
  }

  let messageObject: MessageOptions = {
    content: "",
  };

  // Add message content
  if (content) messageObject.content = content;

  // Format message content for pings
  if (ping || (reply && !shouldReply)) {
    if (content) {
      messageObject.content =
        `${player.ping}, ` + content.charAt(0).toLowerCase() + content.slice(1);
    } else {
      messageObject.content = `${player.ping}`;
    }
  }

  // Ping party members
  if (pingParty && player.party) {
    const pingText = player.party.players.map((x) => `<@${x.user.discordId}>`).join(" ");
    messageObject.content = pingText + " " + content;
  } else if (pingParty) {
    const pingText = player.ping;
    messageObject.content = pingText + " " + content;
  }

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
  if (files && files[0]) {
    messageObject.files = files;
  }

  if (!send) return messageObject as any;

  // Reply to message
  let botMsg: Message<any>;
  if (reply && shouldReply) {
    botMsg = await message.reply(messageObject);
  }
  // Send new message
  else {
    botMsg = await channel.send(messageObject);
  }

  return botMsg as any;
}

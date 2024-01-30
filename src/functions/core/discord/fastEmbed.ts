import { MessageCreateOptions, TextChannel } from "discord.js";
import { game, config } from "../../../tower.js";

/**
 * Send an embed with the default bot formatting.
 */
export default async function fastEmbed<T extends boolean = true>(args: {
  /** Player object. */
  player?: Player;
  /** Embed title. */
  title?: string;
  /** Optional embed description. */
  description?: string;
  /** Optional embed object to further customize message. */
  embed?: Embed;
  /** Optional components. */
  components?: any[];
  /** Optional files. */
  files?: any[];
  /** Send the message or return object with message create options. Default: true. */
  send?: T;
  /** Send the message normally or return game.send object. Default: true. */
  fullSend?: boolean;
  /** Reply to the user's original message. Default: true. */
  reply?: boolean;
  /** Optional embed thumbnail. */
  thumbnail?: string;
  /** Optional message content. */
  content?: string;
  /** Ping all members of the party in the message. Default: false. */
  pingParty?: boolean;
  /** Whether to ping the user or not. Default: false. */
  ping?: boolean;
  color?: EmbedColor;
}): Promise<T extends true ? Message : MessageOptions> {
  const {
    player,
    title,
    embed = {},
    components,
    files,
    send = true,
    reply = true,
    description,
    thumbnail,
    fullSend = true,
    content = ``,
    pingParty = false,
    ping = false,
    color,
  } = args;

  const embedInfo: Embed = {
    title: title ? `**${title}**` : undefined,
  };
  let fullContent = content;

  // Embed color
  embedInfo.color = parseInt("0x" + player.user.embed_color);

  // Override embed color
  if (color) {
    embedInfo.color = config.embedColors[color];
  }

  if (description) embedInfo.description = description;
  if (thumbnail) embedInfo.thumbnail = { url: thumbnail };

  const finalEmbed: Embed = { ...embed, ...embedInfo };

  const messageOptions = {
    player,
    embeds: [finalEmbed],
    components,
    files,
    send,
    reply,
    ping,
    content: fullContent,
    pingParty,
  };

  if (!fullSend) return messageOptions as any;

  return (await game.send(messageOptions)) as any;
}

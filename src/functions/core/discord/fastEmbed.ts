import { MessageCreateOptions, TextChannel } from "discord.js";
import { game, config } from "../../../tower.js";

/**
 * Send an embed with the default bot formatting.
 */
export default async function fastEmbed<T extends boolean = true>(args: {
  message?: Message;
  channel?: TextChannel;
  player?: Player;
  /** Embed title. */
  title?: string;
  /** Optional embed description. */
  description?: string;
  /** Optional embed object to further customize message. */
  embed?: Embed;
  components?: any[];
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
  color?: EmbedColor;
}): Promise<T extends true ? Message : MessageOptions> {
  const {
    message,
    channel,
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
    color,
  } = args;

  const embedInfo: Embed = {
    title: title ? `**${title}**` : undefined,
  };
  let fullContent = content;

  // Player only features
  if (player) {
    // Embed color
    embedInfo.color = parseInt("0x" + player.user.embed_color);

    // Ping party members
    if (pingParty && player.party) {
      const pingText = player.party.players.map((x) => `<@${x.user.discordId}>`).join(" ");
      fullContent = pingText + " " + content;
    } else if (pingParty) {
      const pingText = player.ping;
      fullContent = pingText + " " + content;
    }
  }

  // Override embed color
  if (color) {
    embedInfo.color = config.embedColors[color];
  }

  if (description) embedInfo.description = description;
  if (thumbnail) embedInfo.thumbnail = { url: thumbnail };

  const finalEmbed: Embed = { ...embed, ...embedInfo };

  const messageOptions = {
    message,
    channel,
    embeds: [finalEmbed],
    components,
    files,
    send,
    reply,
    content: fullContent,
  };

  if (!fullSend) return messageOptions as any;

  return (await game.send(messageOptions)) as any;
}

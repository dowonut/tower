import { MessageCreateOptions, TextChannel } from "discord.js";
import { game, config } from "../../../tower.js";

/**
 * Send an embed with the default bot formatting.
 */
export default async function fastEmbed<T extends boolean = true>(args: {
  message: Message;
  player: Player;
  /** Embed title. */
  title: string;
  /** Optional embed description. */
  description?: string;
  /** Optional embed object to further customize message. */
  embed?: Embed;
  components?: any[];
  files?: any[];
  /** Send the message or return object with message create options. Default: true. */
  send?: T;
  /** Reply to the user's original message. Default: true. */
  reply?: boolean;
}): Promise<T extends true ? Message : MessageOptions> {
  const {
    message,
    player,
    title,
    embed = {},
    components,
    files,
    send = true,
    reply = true,
    description,
  } = args;

  const embedInfo: Embed = {
    title: `**${title}**`,
    color: parseInt("0x" + player.user.embed_color),
  };

  if (description) embedInfo.description = description;

  const finalEmbed: Embed = { ...embed, ...embedInfo };

  return (await game.send({
    message,
    embeds: [finalEmbed],
    components,
    files,
    send,
    reply,
  })) as any;
}

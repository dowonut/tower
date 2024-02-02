import { TextChannel } from "discord.js";
import { client, game } from "../../../tower.js";

/** Get a Discord message given channel id and message id. */
export default async function getDiscordMessage(args: { messageId: string; channelId: string }) {
  const { messageId, channelId } = args;
  try {
    const channel = (await client.channels.fetch(channelId)) as TextChannel;
    const message = await channel.messages.fetch({ message: messageId, force: true, cache: true });
    return message;
  } catch (err) {
    return undefined;
  }
}

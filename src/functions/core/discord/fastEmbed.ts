import { MessageCreateOptions, TextChannel } from "discord.js";
import { game, config } from "../../../tower.js";

export default async function fastEmbed<T extends boolean>(args: {
  message: Message;
  player: Player;
  title: string;
  embed: Embed;
  components?: any[];
  files?: any[];
  send?: T;
}): Promise<T extends true ? Message : MessageOptions> {
  const {
    message,
    player,
    title,
    embed = {},
    components = [],
    files = [],
    send = true,
  } = args;

  const embedInfo: Embed = {
    author: {
      name: title,
      icon_url: player.pfp,
    },
    color: parseInt("0x" + player.user.embed_color),
  };

  const finalEmbed: Embed = { ...embed, ...embedInfo };

  return (await game.send({
    message,
    embeds: [finalEmbed],
    components,
    files,
    send,
  })) as any;
}

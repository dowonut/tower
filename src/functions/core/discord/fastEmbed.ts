import { TextChannel } from "discord.js";
import { game, config } from "../../../tower.js";

// export default {
//   fastEmbed: async (
//     message,
//     player,
//     embed,
//     title,
//     file,
//     components,
//     send = true
//   ) => {
//     const color = player.user.embed_color;

//     const embedInfo = {
//       author: {
//         name: title,
//         icon_url: player.pfp,
//       },
//       color: parseInt("0x" + color),
//     };
//     const finalEmbed = { ...embed, ...embedInfo };

//     const messageRef = { embeds: [finalEmbed] };
//     if (file) messageRef.files = [file];
//     if (components && components[0]) messageRef.components = components;

//     if (!send) {
//       return messageRef;
//     } else {
//       return message.channel.send(messageRef);
//     }
//   },
// };

export default async function fastEmbed(args: {
  message: { channel: TextChannel; [key: string]: any };
  player: Player;
  title: string;
  embed: Embed;
  components?: any[];
  files?: any[];
  send?: boolean;
}): Promise<Message> {
  const {
    message,
    player,
    title,
    embed = {},
    components = [],
    files = [],
    send = true,
  } = args;

  const embedInfo: any = {
    author: {
      name: title,
      icon_url: player.pfp,
    },
    color: parseInt("0x" + player.user.embed_color),
  };

  const finalEmbed: Embed = { ...embed, ...embedInfo };

  return await game.send({
    message,
    embeds: [finalEmbed],
    components,
    files,
  });
}

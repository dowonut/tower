import * as config from "../../config.js";

export default {
  fastEmbed: async (
    message,
    player,
    embed,
    title,
    file,
    components,
    send = true
  ) => {
    const color = player.user.embed_color;

    const embedInfo = {
      author: {
        name: title,
        icon_url: player.pfp,
      },
      color: parseInt("0x" + color),
    };
    const finalEmbed = { ...embed, ...embedInfo };

    const messageRef = { embeds: [finalEmbed] };
    if (file) messageRef.files = [file];
    if (components && components[0]) messageRef.components = components;

    if (!send) {
      return messageRef;
    } else {
      return message.channel.send(messageRef);
    }
  },
};

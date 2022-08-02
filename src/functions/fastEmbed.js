import * as config from "../config.js";

export default {
  fastEmbed: (message, player, embed, title, file) => {
    const embedInfo = {
      author: {
        name: title,
        icon_url: player.pfp,
      },
      color: config.botColor,
    };
    const finalEmbed = { ...embed, ...embedInfo };

    if (file) {
      // Send embed with image
      message.channel.send({ embeds: [finalEmbed], files: [file] });
    } else {
      message.channel.send({ embeds: [finalEmbed] });
    }
  },
};

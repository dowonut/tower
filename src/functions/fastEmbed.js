import * as config from "../config.js";

export default {
  fastEmbed: (message, player, embed, title) => {
    const embedInfo = {
      author: {
        name: title,
        icon_url: player.pfp,
      },
      color: config.botColor,
    };
    const finalEmbed = { ...embed, ...embedInfo };

    message.channel.send({ embeds: [finalEmbed] });
  },
};

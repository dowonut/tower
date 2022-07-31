import * as config from "../config.js";

export default {
  fastEmbed: (message, player, embed, title, imageName) => {
    const embedInfo = {
      author: {
        name: title,
        icon_url: player.pfp,
      },
      color: config.botColor,
    };
    const finalEmbed = { ...embed, ...embedInfo };

    if (imageName) {
      // Set embed thumbnail
      finalEmbed.thumbnail = {
        url: `attachment://${imageName}.png`,
      };

      // Get image file
      const file = {
        attachment: `./assets/items/${imageName}.png`,
        name: `${imageName}.png`,
      };

      // Send embed with image
      message.channel.send({ embeds: [finalEmbed], files: [file] });
    } else {
      message.channel.send({ embeds: [finalEmbed] });
    }
  },
};

import * as config from "../../config.js";

export default {
  reply: (message, content, boolean) => {
    // Determine whether to send message as embed
    let useEmbed = true;
    if (boolean !== undefined) useEmbed = boolean;

    // Format reply contents
    const uContent = content.charAt(0).toUpperCase() + content.slice(1);

    // Send reply
    if (!useEmbed) {
      message.reply(`${uContent}`);
    } else {
      const embed = {
        description: config.emojis.bullet + " " + uContent,
        color: config.botColor,
      };
      message.reply({ embeds: [embed] });
    }
  },
};

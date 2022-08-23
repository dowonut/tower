import * as config from "../../config.js";

export default {
  reply: (
    message,
    content,
    boolean,
    color = config.towerColor,
    emoji = config.emojis.bullet
  ) => {
    // Determine whether to send message as embed
    let useEmbed = false;
    if (boolean !== undefined) useEmbed = boolean;

    // Format reply contents
    const uContent = content.charAt(0).toUpperCase() + content.slice(1);

    // Send reply
    if (!useEmbed) {
      var ref = { content: `${uContent}` };
    } else {
      const embed = {
        description: emoji + " " + uContent,
        color: color,
      };
      var ref = { embeds: [embed] };
    }

    if (!message.replied) return message.reply(ref);

    return message.followUp(ref);
  },
};

import * as config from "../../config.js";

export default {
  success: (message, content, boolean = true) => {
    // Format reply contents
    const uContent = content.charAt(0).toUpperCase() + content.slice(1);

    const bullet = config.emojis.level_up;

    const embed = {
      description: `${bullet} ${uContent}`,
      color: config.green,
    };

    if (boolean) {
      var messageRef = { embeds: [embed] };
    } else {
      var messageRef = {
        content: `${bullet} **${message.author.username}**, ${content}`,
      };
    }

    if (!message.replied) return message.reply(messageRef);

    return message.followUp(messageRef);
  },
};

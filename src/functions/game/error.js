import * as config from "../../config.js";

export default {
  error: (message, content, boolean = true) => {
    // Format reply contents
    const uContent = content.charAt(0).toUpperCase() + content.slice(1);

    const embed = {
      description: `:x: ${uContent}`,
      color: config.red,
    };

    if (boolean) {
      var messageRef = { embeds: [embed] };
    } else {
      var messageRef = {
        content: `:x: **${message.author.username}**, ${content}`,
      };
    }

    if (!message.replied) return message.reply(messageRef);

    return message.followUp(messageRef);
  },
};

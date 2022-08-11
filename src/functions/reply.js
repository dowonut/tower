export default {
  reply: (message, content) => {
    message.channel.send(`**${message.author}** ${content}`);
  },
};

export default {
  error: (message, content) => {
    message.channel.send(`:x: **${message.author.username}**, ${content}`);
  },
};

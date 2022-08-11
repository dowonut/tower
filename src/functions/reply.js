export default {
  reply: (message, content) => {
    //message.channel.send(`**${message.author}** ${content}`);
    const uContent = content.charAt(0).toUpperCase() + content.slice(1);
    message.reply(`${uContent}`);
  },
};

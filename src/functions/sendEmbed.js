export default {
  sendEmbed: (message, embed, file) => {
    if (file)
      message.channel.send({
        embeds: [embed],
        files: [file],
      });
    else
      message.channel.send({
        embeds: [embed],
      });
  },
};

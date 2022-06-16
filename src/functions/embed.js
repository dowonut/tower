export default {
  sendEmbed: (message, embed) => {
    message.channel.send({ embeds: [embed] });
  },
};

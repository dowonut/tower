export default {
  fastEmbed: (message, embedInfo) => {
    message.channel.send({ embeds: [embed] });
  },
};

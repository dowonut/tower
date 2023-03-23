export default {
  updateEmbed: async (message, embed) => {
    let newEmbed = message.embeds[0].data;
    newEmbed.description = embed.description;
    return await message.edit({ embeds: [newEmbed] });
  },
};

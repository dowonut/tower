export default {
  sendEmbed: async (message, embed, file, components) => {
    const messageRef = { embeds: [embed] };
    if (file) messageRef.files = [file];
    if (components) messageRef.components = components;

    return await message.channel.send(messageRef);
  },
};

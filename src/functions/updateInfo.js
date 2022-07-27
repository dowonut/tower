export default {
  updateInfo: async (author, player) => {
    await player.update({
      username: author.username,
      discriminator: author.discriminator,
      pfp: author.displayAvatarURL({
        dynamic: false,
        size: 128,
        format: "png",
      }),
    });
  },
};

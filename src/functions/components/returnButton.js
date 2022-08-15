export default {
  returnButton: (row) => {
    const button = {
      id: "back",
      emoji: "↩",
      function: async (reply, i) => {
        // Load original row
        await reply.edit({ components: [row] });
        if (!i.deferred) await i.deferUpdate();
        return;
      },
      stop: true,
    };
    return button;
  },
};

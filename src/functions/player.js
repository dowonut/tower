export default {
  player: {
    // Delete player
    erase: async function () {
      await this.prisma.player.delete({
        where: { id: this.id },
      });
    },

    // Update player
    update: async function (update) {
      return await this.prisma.player.update({
        where: { id: this.id },
        data: update,
      });
    },
  },
};
